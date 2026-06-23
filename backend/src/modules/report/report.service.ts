import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import { FileEntity } from '../media/media.entity';
import Response from '../../commons/response'; 
import { CreateReportDto } from './dto/create-report.dto';
import { Report, ReportStatus } from './report.entity';
import { UpdateStatusDto } from './dto/update-status.dto';
import { ReportDetail } from './report-detail.entity';
import { UpdateReportDto } from './dto/update-report.dto';
import { StatusHistory } from '../reportHistory/report-history.entity';

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(Report) private readonly reportRepository: Repository<Report>,
    @InjectRepository(FileEntity) private readonly fileRepository: Repository<FileEntity>,
    private readonly dataSource: DataSource,
  ) {}

  // 1. Hàm tính tổng an toàn, tự động loại bỏ giá trị null/undefined
  private calculateSum(...args: (number | undefined | null)[]): number | undefined {
    const sum = args.reduce<number>((acc, val) => acc + (Number(val) || 0), 0);
    return sum > 0 ? sum : undefined;
  }

  // 2. Query dùng chung để lấy full relations
  private async findOneById(id: number) {
    return this.reportRepository.findOne({
      where: { id },
      relations: { 
        reportType: true, 
        files: true, 
        doet: { businessType: true, industry: true }, 
        details: { trauma: true, injuryType: true }, 
        statusHistories: { user: true } 
      }
    });
  }

  // 3. Tạo mới báo cáo (Có Transaction chống rác dữ liệu)
  async createReport(dto: CreateReportDto, user: any) {
    if (!user.doetId) throw new BadRequestException('Tài khoản không thuộc doanh nghiệp nào!');

    let savedReportId: number;

    await this.dataSource.transaction(async (manager) => {
      // Tách riêng các trường relation ra khỏi entity chính
      const { details, fileIds, ...reportBase } = dto;
      
      // Khai báo kiểu any để bypass TS báo lỗi nếu CreateReportDto chưa khai báo đủ field M1, M2
      const basePayload: any = reportBase;

      const reportData = manager.create(Report, {
        ...basePayload,
        doetId: user.doetId,
        status: ReportStatus.DRAFT,
        m1TotalCost: this.calculateSum(basePayload.m1MedicalCost, basePayload.m1SalaryCompensation, basePayload.m1PropertyDamage),
        m2TotalCost: this.calculateSum(basePayload.m2MedicalCost, basePayload.m2SalaryCompensation, basePayload.m2PropertyDamage),
      });

      // Lấy danh sách file đính kèm nếu có
      if (fileIds?.length) {
        reportData.files = await manager.findBy(FileEntity, { id: In(fileIds) });
      }

      // Lưu Report
      const savedReport = await manager.save(Report, reportData);
      savedReportId = savedReport.id;

      // Lưu Details nếu có
      if (details?.length) {
        const detailsToSave = details.map(d => manager.create(ReportDetail, {
          ...d,
          report: savedReport,
          totalCost: this.calculateSum(d.medicalCost, d.salaryCompensation, d.propertyDamage)
        }));
        await manager.save(ReportDetail, detailsToSave);
      }
    });

    return Response.get(await this.findOneById(savedReportId!));
  }

  // 4. Cập nhật báo cáo
  async updateReport(id: number, dto: UpdateReportDto, user: any) {
    const report = await this.reportRepository.findOne({ where: { id }, relations: { details: true } });
    
    if (!report) throw new NotFoundException('Không tìm thấy báo cáo!');
    if (user.doetId && report.doetId !== user.doetId) throw new BadRequestException('Không có quyền chỉnh sửa!');
    if (![ReportStatus.DRAFT, ReportStatus.OVERDUE_WARNING, ReportStatus.REJECTED].includes(report.status)) {
      throw new BadRequestException('Trạng thái báo cáo hiện tại không cho phép chỉnh sửa!');
    }

    await this.dataSource.transaction(async (manager) => {
      const { details, fileIds, ...rest } = dto;
      
      // Update thông tin chung
      Object.assign(report, rest);
      report.m1TotalCost = this.calculateSum(report.m1MedicalCost, report.m1SalaryCompensation, report.m1PropertyDamage);
      report.m2TotalCost = this.calculateSum(report.m2MedicalCost, report.m2SalaryCompensation, report.m2PropertyDamage);

      if (fileIds !== undefined) {
        report.files = fileIds.length > 0 ? await manager.findBy(FileEntity, { id: In(fileIds) }) : [];
      }

      if (details) {
        await manager.delete(ReportDetail, { reportId: report.id });
        const newDetails = details.map(d => manager.create(ReportDetail, { 
            ...d, 
            report, 
            totalCost: this.calculateSum(d.medicalCost, d.salaryCompensation, d.propertyDamage) 
        }));
        report.details = await manager.save(ReportDetail, newDetails);
      }

      await manager.save(Report, report);
    });

    return Response.get(await this.findOneById(id));
  }

  async changeStatus(id: number, dto: UpdateStatusDto, user: any) {
    const report = await this.reportRepository.findOne({ where: { id } });
    if (!report) throw new NotFoundException('Không tìm thấy báo cáo!');

    await this.dataSource.transaction(async (manager) => {
      report.status = dto.status;
      await manager.save(Report, report);
      
      const history = manager.create(StatusHistory, {
        reportId: report.id,
        status: dto.status,
        note: dto.note || '',
        userId: user.id
      });
      await manager.save(StatusHistory, history);
    });

    return Response.get({ id: report.id, status: report.status });
  }

  async getDetailForFE(id: number) {
    const report = await this.findOneById(id);
    if (!report) throw new NotFoundException('Không tìm thấy báo cáo!');

    return Response.get({
      overview: {
        id: report.id, title: report.title, year: report.year, status: report.status,
        companyInfo: { 
          totalEmployees: report.totalEmployees, 
          femaleEmployees: report.femaleEmployees, 
          totalPayroll: report.totalPayroll 
        },
        summaryM1: {
          totalCases: report.m1TotalCases, fatalCases: report.m1FatalCases, multiVictimCases: report.m1MultiVictimCases,
          totalVictims: report.m1TotalVictims, femaleVictims: report.m1FemaleVictims, fatalVictims: report.m1FatalVictims, 
          severeInjuries: report.m1SevereInjuries, totalLeaveDays: report.m1TotalLeaveDays, totalDamage: report.m1TotalDamage,
          medicalCost: report.m1MedicalCost, salaryCompensation: report.m1SalaryCompensation, propertyDamage: report.m1PropertyDamage, totalCost: report.m1TotalCost
        },
        summaryM2: {
          totalCases: report.m2TotalCases, fatalCases: report.m2FatalCases, multiVictimCases: report.m2MultiVictimCases,
          totalVictims: report.m2TotalVictims, femaleVictims: report.m2FemaleVictims, fatalVictims: report.m2FatalVictims, 
          severeInjuries: report.m2SevereInjuries, totalLeaveDays: report.m2TotalLeaveDays, totalDamage: report.m2TotalDamage,
          medicalCost: report.m2MedicalCost, salaryCompensation: report.m2SalaryCompensation, propertyDamage: report.m2PropertyDamage, totalCost: report.m2TotalCost
        },
        reportConfig: report.reportType, 
        company: report.doet, 
        attachedFiles: report.files || []
      },
      details: (report.details || []).map(d => ({ 
        ...d, 
        traumaName: d.trauma?.name, 
        injuryTypeName: d.injuryType?.name 
      })),
      timeline: (report.statusHistories || []).map(h => ({
        id: h.id, 
        status: h.status, 
        note: h.note, 
        createdAt: h.createdAt, 
        handler: h.user?.fullName || h.user?.username || 'Hệ thống'
      }))
    });
  }

  async getAllForAdmin(query: any) {
    const qb = this.reportRepository.createQueryBuilder('r')
      .leftJoinAndSelect('r.doet', 'd')
      .leftJoinAndSelect('r.reportType', 'rt');
      
    if (query.year) qb.andWhere('r.year = :year', { year: Number(query.year) });
    if (query.status) qb.andWhere('r.status = :status', { status: query.status });
    if (query.businessName) qb.andWhere('d.name LIKE :bName', { bName: `%${query.businessName}%` });

    const page = Number(query.page) || 1;
    const pageSize = Number(query.pageSize) || 10;
    
    qb.orderBy('r.year', 'DESC').addOrderBy('r.id', 'DESC'); // Sắp xếp mới nhất
    qb.skip((page - 1) * pageSize).take(pageSize);
    
    const [items, total] = await qb.getManyAndCount();
    return Response.get({ items, total, page, pageSize });
  }

  async getAllForBusiness(query: any, user: any) {
    const qb = this.reportRepository.createQueryBuilder('r')
      .leftJoinAndSelect('r.reportType', 'rt')
      .where('r.doetId = :doetId', { doetId: user.doetId });

    if (query.year) qb.andWhere('r.year = :year', { year: Number(query.year) });
    if (query.status) qb.andWhere('r.status = :status', { status: query.status });

    const page = Number(query.page) || 1;
    const pageSize = Number(query.pageSize) || 10;
    
    qb.orderBy('r.year', 'DESC').addOrderBy('r.id', 'DESC'); // Sắp xếp mới nhất
    qb.skip((page - 1) * pageSize).take(pageSize);
    
    const [items, total] = await qb.getManyAndCount();
    return Response.get({ items, total, page, pageSize });
  }

  async getSummaryReport(year: number) {
    const rawSummary = await this.reportRepository.createQueryBuilder('r')
      .leftJoin('r.doet', 'd')
      .leftJoin('d.businessType', 'bt')
      .select('bt.name', 'businesstypename')
      .addSelect('COUNT(DISTINCT d.id)', 'totalcompanies')
      .addSelect('SUM(r.m1TotalCases)', 'sumtotalcases')
      .addSelect('SUM(r.m1FatalCases)', 'sumfatalcases')
      .addSelect('SUM(r.m1TotalVictims)', 'sumtotalvictims')
      .addSelect('SUM(r.m1FemaleVictims)', 'sumfemalevictims')
      .addSelect('SUM(r.m1FatalVictims)', 'sumfatalvictims')
      .addSelect('SUM(r.m1SevereInjuries)', 'sumsevereinjuries')
      .addSelect('SUM(r.m1MedicalCost)', 'summedicalcost')
      .addSelect('SUM(r.m1SalaryCompensation)', 'sumsalarycompensation')
      .addSelect('SUM(r.m1PropertyDamage)', 'sumpropertydamage')
      .addSelect('SUM(r.m1TotalCost)', 'sumtotalcost')
      .where('r.year = :year', { year })
      .andWhere('r.status = :status', { status: ReportStatus.APPROVED }) 
      .groupBy('bt.name')
      .getRawMany();

    return Response.get(rawSummary.map(row => ({
      businessTypeName: row.businesstypename || 'Chưa phân loại hình thức',
      totalCompanies: Number(row.totalcompanies) || 0,
      casesReport: { 
        totalCases: Number(row.sumtotalcases) || 0, 
        fatalCases: Number(row.sumfatalcases) || 0 
      },
      victimsReport: {
        totalVictims: Number(row.sumtotalvictims) || 0, 
        femaleVictims: Number(row.sumfemalevictims) || 0,
        fatalVictims: Number(row.sumfatalvictims) || 0, 
        severeInjuries: Number(row.sumsevereinjuries) || 0
      },
      financialReport: {
        medicalCost: Number(row.summedicalcost) || 0, 
        salaryCompensation: Number(row.sumsalarycompensation) || 0,
        propertyDamage: Number(row.sumpropertydamage) || 0, 
        totalCost: Number(row.sumtotalcost) || 0
      }
    })));
  }
}