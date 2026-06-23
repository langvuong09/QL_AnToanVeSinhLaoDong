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

  async createReport(dto: CreateReportDto, user: any) {
    if (!user.doetId) {
      throw new BadRequestException('Tài khoản của bạn không thuộc doanh nghiệp nào để khai báo!');
    }

    const reportData: Partial<Report> = {
      title: dto.title,
      year: dto.year,
      reportTypeId: dto.reportTypeId,
      doetId: user.doetId,
      status: ReportStatus.DRAFT,
      totalEmployees: dto.totalEmployees,
      femaleEmployees: dto.femaleEmployees,

      m1TotalCases: dto.m1TotalCases, m1FatalCases: dto.m1FatalCases, m1MultiVictimCases: dto.m1MultiVictimCases,
      m1TotalVictims: dto.m1TotalVictims, m1FemaleVictims: dto.m1FemaleVictims, m1FatalVictims: dto.m1FatalVictims,
      m1SevereInjuries: dto.m1SevereInjuries, m1NonManagedVictims: dto.m1NonManagedVictims,
      m1NonManagedFemaleVictims: dto.m1NonManagedFemaleVictims, m1NonManagedFatalVictims: dto.m1NonManagedFatalVictims,
      m1NonManagedSevereInjuries: dto.m1NonManagedSevereInjuries,
      m1MedicalCost: dto.m1MedicalCost, m1SalaryCompensation: dto.m1SalaryCompensation,
      m1PropertyDamage: dto.m1PropertyDamage,
      
      m2TotalCases: dto.m2TotalCases, m2FatalCases: dto.m2FatalCases, m2MultiVictimCases: dto.m2MultiVictimCases,
      m2TotalVictims: dto.m2TotalVictims, m2FemaleVictims: dto.m2FemaleVictims, m2FatalVictims: dto.m2FatalVictims,
      m2SevereInjuries: dto.m2SevereInjuries, m2NonManagedVictims: dto.m2NonManagedVictims,
      m2NonManagedFemaleVictims: dto.m2NonManagedFemaleVictims, m2NonManagedFatalVictims: dto.m2NonManagedFatalVictims,
      m2NonManagedSevereInjuries: dto.m2NonManagedSevereInjuries,
      m2MedicalCost: dto.m2MedicalCost, m2SalaryCompensation: dto.m2SalaryCompensation,
      m2PropertyDamage: dto.m2PropertyDamage,
    };

    const m1TotalCost = (Number(dto.m1MedicalCost) || 0) + (Number(dto.m1SalaryCompensation) || 0) + (Number(dto.m1PropertyDamage) || 0);
    const m2TotalCost = (Number(dto.m2MedicalCost) || 0) + (Number(dto.m2SalaryCompensation) || 0) + (Number(dto.m2PropertyDamage) || 0);

    reportData.m1TotalCost = m1TotalCost > 0 ? m1TotalCost : undefined;
    reportData.m2TotalCost = m2TotalCost > 0 ? m2TotalCost : undefined;

    const report = this.reportRepository.create(reportData);

    if (dto.fileIds && dto.fileIds.length > 0) {
      report.files = await this.fileRepository.findBy({ id: In(dto.fileIds) });
    }

    const savedReport = await this.reportRepository.save(report);

    if (dto.details && dto.details.length > 0) {
      const detailsToSave = dto.details.map(detail => {
        const hasFinancialData = detail.medicalCost !== null && detail.medicalCost !== undefined || 
                                detail.salaryCompensation !== null && detail.salaryCompensation !== undefined || 
                                detail.propertyDamage !== null && detail.propertyDamage !== undefined;
        
        let calculatedTotal: number | undefined = undefined;
        if (hasFinancialData) {
          calculatedTotal = (Number(detail.medicalCost) || 0) + 
                            (Number(detail.salaryCompensation) || 0) + 
                            (Number(detail.propertyDamage) || 0);
        }

        return this.dataSource.getRepository(ReportDetail).create({
          ...detail,
          report: savedReport,
          cause: detail.cause ?? undefined,
          medicalCost: detail.medicalCost ?? undefined,
          salaryCompensation: detail.salaryCompensation ?? undefined,
          propertyDamage: detail.propertyDamage ?? undefined,
          totalCost: calculatedTotal
        });
      });
      await this.dataSource.getRepository(ReportDetail).save(detailsToSave);
    }

    return Response.get(await this.reportRepository.findOne({
      where: { id: savedReport.id },
      relations: { doet: { businessType: true, industry: true }, reportType: true, files: true, details: true }
    }));
  }

  async updateReport(id: number, dto: UpdateReportDto, user: any) {
  const report = await this.reportRepository.findOne({ 
    where: { id }, 
    relations: { details: true, files: true } 
  });

  if (!report) throw new NotFoundException('Không tìm thấy báo cáo!');
  if (user.doetId && report.doetId !== user.doetId) throw new BadRequestException('Không có quyền chỉnh sửa!');
  
  const editableStatuses = [ReportStatus.DRAFT, ReportStatus.OVERDUE_WARNING, ReportStatus.REJECTED];
  if (!editableStatuses.includes(report.status)) {
    throw new BadRequestException('Báo cáo đã nộp hoặc được phê duyệt, không thể chỉnh sửa!');
  }

  const calculateTotal = (med: number | undefined, sal: number | undefined, prop: number | undefined): number | undefined => {
    const sum = (Number(med) || 0) + (Number(sal) || 0) + (Number(prop) || 0);
    return sum > 0 ? sum : undefined;
  };

  await this.dataSource.transaction(async (manager) => {
    const { details, fileIds, ...rest } = dto;
    Object.assign(report, rest);

    report.m1TotalCost = calculateTotal(report.m1MedicalCost, report.m1SalaryCompensation, report.m1PropertyDamage);
    report.m2TotalCost = calculateTotal(report.m2MedicalCost, report.m2SalaryCompensation, report.m2PropertyDamage);

    if (fileIds !== undefined) {
      report.files = fileIds.length > 0 ? await manager.findBy(FileEntity, { id: In(fileIds) }) : [];
    }

    if (details) {
      await manager.delete(ReportDetail, { report: { id: report.id } });
      
      const newDetails = details.map(detail => manager.create(ReportDetail, {
        ...detail,
        report: report,
        totalCost: calculateTotal(detail.medicalCost, detail.salaryCompensation, detail.propertyDamage)
      }));
      
      report.details = await manager.save(ReportDetail, newDetails);
    }

    await manager.save(Report, report);
  });

  return Response.get(await this.reportRepository.findOne({
    where: { id },
    relations: { doet: { businessType: true, industry: true }, reportType: true, files: true, details: true }
  }));
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
    const report = await this.reportRepository.findOne({
      where: { id },
      relations: { reportType: true, files: true, doet: { businessType: true, industry: true }, details: { trauma: true, injuryType: true }, statusHistories: { user: true } },
    });

    if (!report) throw new NotFoundException('Không tìm thấy bản báo cáo yêu cầu!');

    return Response.get({
      overview: {
        id: report.id, title: report.title, year: report.year, status: report.status,
        companyInfo: { totalEmployees: report.totalEmployees, femaleEmployees: report.femaleEmployees },
        summaryM1: {
          totalCases: report.m1TotalCases, fatalCases: report.m1FatalCases, multiVictimCases: report.m1MultiVictimCases,
          totalVictims: report.m1TotalVictims, femaleVictims: report.m1FemaleVictims, fatalVictims: report.m1FatalVictims, severeInjuries: report.m1SevereInjuries,
          nonManagedVictims: report.m1NonManagedVictims, nonManagedFemaleVictims: report.m1NonManagedFemaleVictims, 
          nonManagedFatalVictims: report.m1NonManagedFatalVictims, nonManagedSevereInjuries: report.m1NonManagedSevereInjuries,
          medicalCost: report.m1MedicalCost, salaryCompensation: report.m1SalaryCompensation, propertyDamage: report.m1PropertyDamage, totalCost: report.m1TotalCost
        },
        summaryM2: {
          totalCases: report.m2TotalCases, fatalCases: report.m2FatalCases, multiVictimCases: report.m2MultiVictimCases,
          totalVictims: report.m2TotalVictims, femaleVictims: report.m2FemaleVictims, fatalVictims: report.m2FatalVictims, severeInjuries: report.m2SevereInjuries,
          nonManagedVictims: report.m2NonManagedVictims, nonManagedFemaleVictims: report.m2NonManagedFemaleVictims, 
          nonManagedFatalVictims: report.m2NonManagedFatalVictims, nonManagedSevereInjuries: report.m2NonManagedSevereInjuries,
          medicalCost: report.m2MedicalCost, salaryCompensation: report.m2SalaryCompensation, propertyDamage: report.m2PropertyDamage, totalCost: report.m2TotalCost
        },
        reportConfig: report.reportType, company: report.doet, attachedFiles: report.files || []
      },
      details: (report.details || []).map(detail => ({
        ...detail,
        traumaName: detail.trauma?.name,
        injuryTypeName: detail.injuryType?.name
      })),
      timeline: report.statusHistories?.map(h => ({
        id: h.id, status: h.status, note: h.note, createdAt: h.createdAt, handler: h.user?.fullName || h.user?.username || 'Hệ thống'
      })) || []
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
    qb.skip((page - 1) * pageSize).take(pageSize);

    const [items, total] = await qb.getManyAndCount();
    return Response.get({ items, total, page, pageSize });
  }

  async getAllForBusiness(query: any, user: any) {
    const qb = this.reportRepository.createQueryBuilder('r')
      .leftJoinAndSelect('r.reportType', 'rt')
      .leftJoinAndSelect('r.doet', 'd') 
      .leftJoinAndSelect('d.businessType', 'bt') 
      .leftJoinAndSelect('d.industry', 'i')      
      .where('r.doetId = :doetId', { doetId: user.doetId });

    if (query.year) qb.andWhere('r.year = :year', { year: Number(query.year) });
    if (query.status) qb.andWhere('r.status = :status', { status: query.status });

    const page = Number(query.page) || 1;
    const pageSize = Number(query.pageSize) || 10;
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
      casesReport: { totalCases: Number(row.sumtotalcases) || 0, fatalCases: Number(row.sumfatalcases) || 0 },
      victimsReport: {
        totalVictims: Number(row.sumtotalvictims) || 0, femaleVictims: Number(row.sumfemalevictims) || 0,
        fatalVictims: Number(row.sumfatalvictims) || 0, severeInjuries: Number(row.sumsevereinjuries) || 0
      },
      financialReport: {
        medicalCost: Number(row.summedicalcost) || 0, salaryCompensation: Number(row.sumsalarycompensation) || 0,
        propertyDamage: Number(row.sumpropertydamage) || 0, totalCost: Number(row.sumtotalcost) || 0
      }
    })));
  }
}