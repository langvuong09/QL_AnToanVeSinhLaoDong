import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import { FileEntity } from '../media/media.entity';
import Response from '../../commons/response'; 
import { CreateReportDto } from '../report/dto/create-report.dto';
import { Report, ReportStatus } from '../report/report.entity';
import { UpdateStatusDto } from '../report/dto/update-status.dto';
import { ReportDetail } from '../report/report-detail.entity';
import { UpdateReportDto } from './dto/update-report.dto';

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

    const parsedDetails = dto.details.map(detail => {
      const hasFinancialData = detail.medicalCost !== null || detail.salaryCompensation !== null || detail.propertyDamage !== null;
      let calculatedTotal: number | null = null;
      
      if (hasFinancialData) {
        calculatedTotal = (Number(detail.medicalCost) || 0) + 
                          (Number(detail.salaryCompensation) || 0) + 
                          (Number(detail.propertyDamage) || 0);
      }

      return {
        ...detail,
        medicalCost: detail.medicalCost !== undefined ? detail.medicalCost : null,
        salaryCompensation: detail.salaryCompensation !== undefined ? detail.salaryCompensation : null,
        propertyDamage: detail.propertyDamage !== undefined ? detail.propertyDamage : null,
        totalCost: calculatedTotal
      };
    });

    const report = this.reportRepository.create({
      title: dto.title,
      year: dto.year,
      reportTypeId: dto.reportTypeId,
      doetId: user.doetId,
      status: ReportStatus.DRAFT,
      details: parsedDetails as any,
    });

    if (dto.fileIds && dto.fileIds.length > 0) {
      const files = await this.fileRepository.findBy({ id: In(dto.fileIds) });
      report.files = files;
    }

    const savedReport = await this.reportRepository.save(report);

    const fullyLoadedReport = await this.reportRepository.findOne({
      where: { id: savedReport.id },
      relations: {
        doet: {
          businessType: true, // Nạp kèm loại hình kinh doanh
          industry: true,     // Nạp kèm ngành nghề
        },        
        reportType: true, 
        files: true,       
        details: true     
      }
    });

    return Response.get(fullyLoadedReport);
  }

  async changeStatus(id: number, dto: UpdateStatusDto, user: any) {
    const report = await this.reportRepository.findOne({ 
      where: { id },
      relations: { details: true }
    });
    if (!report) throw new NotFoundException('Không tìm thấy báo cáo yêu cầu');

    const current = report.status;
    const target = dto.status;

    const validTransitions: Record<ReportStatus, ReportStatus[]> = {
      [ReportStatus.DRAFT]: [ReportStatus.SUBMITTED, ReportStatus.OVERDUE_WARNING],                    
      [ReportStatus.OVERDUE_WARNING]: [ReportStatus.SUBMITTED],                    
      [ReportStatus.SUBMITTED]: [ReportStatus.APPROVED, ReportStatus.REJECTED], 
      [ReportStatus.APPROVED]: [],                                        
      [ReportStatus.REJECTED]: [ReportStatus.SUBMITTED],                 
    };

    if (!validTransitions[current].includes(target)) {
      throw new BadRequestException(`Sai tiến độ! Không thể chuyển trạng thái từ [${current}] sang [${target}].`);
    }

    if (target === ReportStatus.SUBMITTED) {
      if (!report.details || report.details.length === 0) {
        throw new BadRequestException('Không thể gửi báo cáo trống dữ liệu biểu mẫu!');
      }

      const requiredFields = [
        'totalCases', 'fatalCases', 'multiVictimCases', 
        'totalVictims', 'femaleVictims', 'fatalVictims', 'severeInjuries',
        'nonManagedVictims', 'nonManagedFemaleVictims', 'nonManagedFatalVictims', 'nonManagedSevereInjuries',
        'medicalCost', 'salaryCompensation', 'propertyDamage'
      ];

      for (const [index, detail] of report.details.entries()) {
        for (const field of requiredFields) {
          const value = (detail as any)[field];
          if (value === null || value === undefined) {
            const rowIdentifier = detail.traumaId ? `Dòng Nguyên nhân ID ${detail.traumaId}` : `Dòng Chấn thương ID ${detail.injuryTypeId}`;
            throw new BadRequestException(`Trường [${field}] tại [${rowIdentifier}] (Dòng số ${index + 1}) chưa được điền số liệu!`);
          }
        }
      }
    }

    report.status = target;
    await this.reportRepository.save(report);

    return Response.SUCCESSFULLY;
  }

  async getAllForAdmin(query: any) {
    const page = Number(query.page) || 1;
    const pageSize = Number(query.pageSize) || 10;
    const { province, district, ward, businessName, taxCode, period, status, year } = query;

    const queryBuilder = this.reportRepository.createQueryBuilder('r')
      .leftJoinAndSelect('r.doet', 'd')
      .leftJoinAndSelect('d.businessType', 'bt')
      .leftJoinAndSelect('d.industry', 'i')      
      .leftJoinAndSelect('r.reportType', 'rt')
      .where('1=1');

    if (year) queryBuilder.andWhere('r.year = :year', { year: Number(year) });
    if (status) queryBuilder.andWhere('r.status = :status', { status });
    if (taxCode) queryBuilder.andWhere('d.taxCode ILike :taxCode', { taxCode: `%${taxCode.trim()}%` });
    if (businessName) queryBuilder.andWhere('d.name ILike :businessName', { businessName: `%${businessName.trim()}%` });
    if (period) queryBuilder.andWhere('rt.period = :period', { period: period.trim() });

    if (province) queryBuilder.andWhere("d.province->>'value' ILike :province", { province: `%${province}%` });
    if (district) queryBuilder.andWhere("d.district->>'value' ILike :district", { district: `%${district}%` });
    if (ward) queryBuilder.andWhere("d.ward->>'value' ILike :ward", { ward: `%${ward}%` });

    queryBuilder.orderBy('r.id', 'DESC');

    const [items, totalCount] = await queryBuilder
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();

    const formattedItems = items.map(report => ({
      id: report.id,
      title: report.title,
      year: report.year,
      status: report.status,
      period: report.reportType?.period || 'Cả năm',
      startDate: report.reportType?.startDate || null,
      endDate: report.reportType?.endDate || null,
      business: {
        id: report.doet?.id,
        name: report.doet?.name,
        taxCode: report.doet?.taxCode,
        province: report.doet?.province,
        district: report.doet?.district,
        ward: report.doet?.ward,
        businessType: report.doet?.businessType || null, 
        industry: report.doet?.industry || null       
      },
      attachedFiles: report.files || []
    }));

    return Response.getList({ items: formattedItems, count: totalCount, pageSize, pageNumber: page });
  }

  async getAllForBusiness(query: any, user: any) {
    if (!user.doetId) {
      throw new BadRequestException('Tài khoản của bạn không gắn liền với doanh nghiệp nào!');
    }

    const page = Number(query.page) || 1;
    const pageSize = Number(query.pageSize) || 10;
    const { year, period, status } = query;

    const queryBuilder = this.reportRepository.createQueryBuilder('r')
      .leftJoinAndSelect('r.doet', 'd') 
      .leftJoinAndSelect('d.businessType', 'bt') 
      .leftJoinAndSelect('d.industry', 'i')      
      .leftJoinAndSelect('r.reportType', 'rt')
      .where('r.doetId = :doetId', { doetId: user.doetId });

    if (year) queryBuilder.andWhere('r.year = :year', { year: Number(year) });
    if (status) queryBuilder.andWhere('r.status = :status', { status });
    if (period) queryBuilder.andWhere('rt.period = :period', { period: period.trim() });

    queryBuilder.orderBy('r.id', 'DESC');

    const [items, totalCount] = await queryBuilder
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();

    const formattedItems = items.map(report => ({
      id: report.id,
      title: report.title,
      year: report.year,
      status: report.status,
      period: report.reportType?.period || 'Cả năm',
      startDate: report.reportType?.startDate || null,
      endDate: report.reportType?.endDate || null,
      business: {
        id: report.doet?.id,
        name: report.doet?.name,
        taxCode: report.doet?.taxCode,
        province: report.doet?.province,
        district: report.doet?.district,
        ward: report.doet?.ward,
        businessType: report.doet?.businessType || null, // Map thêm dữ liệu trả ra
        industry: report.doet?.industry || null          // Map thêm dữ liệu trả ra
      },
      attachedFiles: report.files || []
    }));

    return Response.getList({ items: formattedItems, count: totalCount, pageSize, pageNumber: page });
  }

  async getDetailForFE(id: number) {
    const report = await this.reportRepository.findOne({
      where: { id },
      relations: {
        reportType: true,
        files: true,
        doet: {
          businessType: true,
          industry: true,
        },
        details: {
          trauma: true,
          injuryType: true,
        },
        statusHistories: {
          user: true,
        },
      },
    });

    if (!report) throw new NotFoundException('Không tìm thấy bản báo cáo yêu cầu!');

    const tableRows = report.details.map(detail => ({
      detailId: detail.id,
      categoryType: detail.traumaId ? 'TRAUMA' : (detail.injuryTypeId ? 'INJURY' : 'GENERAL'),
      criteriaId: detail.traumaId || detail.injuryTypeId,
      criteriaCode: detail.trauma?.code || detail.injuryType?.code || 'N/A',
      criteriaName: detail.trauma?.name || detail.injuryType?.name || 'Tổng quan',
      
      totalCases: detail.totalCases,
      fatalCases: detail.fatalCases,
      multiVictimCases: detail.multiVictimCases,
      totalVictims: detail.totalVictims,
      femaleVictims: detail.femaleVictims,
      fatalVictims: detail.fatalVictims,
      severeInjuries: detail.severeInjuries,

      nonManagedVictims: detail.nonManagedVictims,
      nonManagedFemaleVictims: detail.nonManagedFemaleVictims,
      nonManagedFatalVictims: detail.nonManagedFatalVictims,
      nonManagedSevereInjuries: detail.nonManagedSevereInjuries,

      medicalCost: detail.medicalCost ? Number(detail.medicalCost) : null,
      salaryCompensation: detail.salaryCompensation ? Number(detail.salaryCompensation) : null,
      propertyDamage: detail.propertyDamage ? Number(detail.propertyDamage) : null,
      totalCost: detail.totalCost ? Number(detail.totalCost) : null
    }));

    return Response.get({
      overview: {
        id: report.id,
        title: report.title,
        year: report.year,
        status: report.status,
        reportConfig: {
          id: report.reportType?.id,
          name: report.reportType?.name,
          period: report.reportType?.period,
          startDate: report.reportType?.startDate,
          endDate: report.reportType?.endDate
        },
        company: report.doet,
        attachedFiles: report.files || []
      },
      tableRows,
      timeline: report.statusHistories?.map(h => ({
        id: h.id,
        status: h.status,
        note: h.note,
        createdAt: h.createdAt,
        handler: h.user?.fullName || h.user?.username || 'Hệ thống'
      })) || []
    });
  }

  async getSummaryReport(year: number) {
    const rawSummary = await this.dataSource.getRepository(ReportDetail).createQueryBuilder('rd')
      .leftJoin('rd.report', 'r')
      .leftJoin('r.doet', 'd')
      .leftJoin('d.businessType', 'bt')
      .select('bt.name', 'businesstypename')
      .addSelect('COUNT(DISTINCT d.id)', 'totalcompanies')
      .addSelect('SUM(rd.totalCases)', 'sumtotalcases')
      .addSelect('SUM(rd.fatalCases)', 'sumfatalcases')
      .addSelect('SUM(rd.totalVictims)', 'sumtotalvictims')
      .addSelect('SUM(rd.femaleVictims)', 'sumfemalevictims')
      .addSelect('SUM(rd.fatalVictims)', 'sumfatalvictims')
      .addSelect('SUM(rd.severeInjuries)', 'sumsevereinjuries')
      .addSelect('SUM(rd.medicalCost)', 'summedicalcost')
      .addSelect('SUM(rd.salaryCompensation)', 'sumsalarycompensation')
      .addSelect('SUM(rd.propertyDamage)', 'sumpropertydamage')
      .addSelect('SUM(rd.totalCost)', 'sumtotalcost')
      .where('r.year = :year', { year })
      .andWhere('r.status = :status', { status: ReportStatus.APPROVED }) 
      .groupBy('bt.name')
      .getRawMany();

    const formattedSummary = rawSummary.map(row => ({
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
    }));

    return Response.get(formattedSummary);
  }

  async updateReport(id: number, dto: UpdateReportDto, user: any) {
    const report = await this.reportRepository.findOne({
      where: { id },
      relations: { details: true, files: true }
    });

    if (!report) throw new NotFoundException('Không tìm thấy báo cáo cần cập nhật!');
    
    if (user.doetId && report.doetId !== user.doetId) {
      throw new BadRequestException('Bạn không có quyền chỉnh sửa báo cáo của doanh nghiệp khác!');
    }

    if (report.status !== ReportStatus.DRAFT && report.status !== ReportStatus.OVERDUE_WARNING && report.status !== ReportStatus.REJECTED) {
      throw new BadRequestException(`Báo cáo đang ở trạng thái [${report.status}], không được phép chỉnh sửa!`);
    }

    await this.dataSource.transaction(async (transactionalEntityManager) => {
      if (dto.title) report.title = dto.title;
      if (dto.year) report.year = dto.year;
      if (dto.reportTypeId) report.reportTypeId = dto.reportTypeId;

      if (dto.fileIds) {
        if (dto.fileIds.length > 0) {
          const files = await transactionalEntityManager.findBy(FileEntity, { id: In(dto.fileIds) });
          report.files = files;
        } else {
          report.files = [];
        }
      }

      if (dto.details) {
        await transactionalEntityManager.delete(ReportDetail, { reportId: report.id });

        const newDetails = dto.details.map(detail => {
          const hasFinancialData = detail.medicalCost !== null || detail.salaryCompensation !== null || detail.propertyDamage !== null;
          let calculatedTotal: number | null = null;
          
          if (hasFinancialData) {
            calculatedTotal = (Number(detail.medicalCost) || 0) + 
                              (Number(detail.salaryCompensation) || 0) + 
                              (Number(detail.propertyDamage) || 0);
          }

          const cleanDetail: any = {
            reportId: report.id,
            totalCases: detail.totalCases !== undefined ? detail.totalCases : null,
            fatalCases: detail.fatalCases !== undefined ? detail.fatalCases : null,
            multiVictimCases: detail.multiVictimCases !== undefined ? detail.multiVictimCases : null,
            totalVictims: detail.totalVictims !== undefined ? detail.totalVictims : null,
            femaleVictims: detail.femaleVictims !== undefined ? detail.femaleVictims : null,
            fatalVictims: detail.fatalVictims !== undefined ? detail.fatalVictims : null,
            severeInjuries: detail.severeInjuries !== undefined ? detail.severeInjuries : null,
            nonManagedVictims: detail.nonManagedVictims !== undefined ? detail.nonManagedVictims : null,
            nonManagedFemaleVictims: detail.nonManagedFemaleVictims !== undefined ? detail.nonManagedFemaleVictims : null,
            nonManagedFatalVictims: detail.nonManagedFatalVictims !== undefined ? detail.nonManagedFatalVictims : null,
            nonManagedSevereInjuries: detail.nonManagedSevereInjuries !== undefined ? detail.nonManagedSevereInjuries : null,
            medicalCost: detail.medicalCost !== undefined ? detail.medicalCost : null,
            salaryCompensation: detail.salaryCompensation !== undefined ? detail.salaryCompensation : null,
            propertyDamage: detail.propertyDamage !== undefined ? detail.propertyDamage : null,
            totalCost: calculatedTotal
          };

          if (detail.traumaId) cleanDetail.traumaId = detail.traumaId;
          if (detail.injuryTypeId) cleanDetail.injuryTypeId = detail.injuryTypeId;

          return transactionalEntityManager.create(ReportDetail, cleanDetail);
        });

        report.details = newDetails;
      }

      await transactionalEntityManager.save(report);
    });

    const updatedReport = await this.reportRepository.findOne({
      where: { id },
      relations: { 
        doet: {
          businessType: true, 
          industry: true,    
        }, 
        reportType: true, 
        files: true, 
        details: true 
      }
    });

    return Response.get(updatedReport);
  }
}