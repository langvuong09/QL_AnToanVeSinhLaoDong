import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, In, DataSource, IsNull } from 'typeorm';
import { Report, ReportStatus } from './report.entity';
import { Doet } from '../doet/doet.entity';
import { ReportType } from '../typeReport/report-type.entity';

@Injectable()
export class ReportSchedulerService {
  private readonly logger = new Logger(ReportSchedulerService.name);

  constructor(
    @InjectRepository(Report)
    private readonly reportRepository: Repository<Report>,
    private readonly dataSource: DataSource,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async checkOverdueReports() {
    this.logger.log('--- [CRON JOB] Bắt đầu quét kiểm tra thời hạn báo cáo ---');
    const now = new Date();
    const reportsToOverdue = await this.reportRepository.createQueryBuilder('r')
      .leftJoinAndSelect('r.reportType', 'rt')
      .where('r.status IN (:...statuses)', { 
        statuses: [ReportStatus.DRAFT, ReportStatus.OVERDUE_WARNING] 
      })
      .andWhere('rt.endDate < :now', { now }) 
      .getMany();

    if (reportsToOverdue.length > 0) {
      const overdueIds = reportsToOverdue.map(r => r.id);
      await this.reportRepository.update(
        { id: In(overdueIds) },
        { status: ReportStatus.OVERDUE }
      );
      this.logger.log(`➔ Đã chuyển [OVERDUE] cho ${reportsToOverdue.length} báo cáo (IDs: ${overdueIds.join(', ')}).`);
    }

    const targetWarningDate = new Date();
    targetWarningDate.setDate(targetWarningDate.getDate() + 5); 

    const reportsToWarning = await this.reportRepository.createQueryBuilder('r')
      .leftJoinAndSelect('r.reportType', 'rt')
      .where('r.status = :status', { status: ReportStatus.DRAFT })
      .andWhere('rt.endDate <= :targetWarningDate', { targetWarningDate })
      .andWhere('rt.endDate >= :now', { now })
      .getMany();

    if (reportsToWarning.length > 0) {
      const warningIds = reportsToWarning.map(r => r.id);
      await this.reportRepository.update(
        { id: In(warningIds) },
        { status: ReportStatus.OVERDUE_WARNING }
      );
      this.logger.log(`➔ Đã chuyển [OVERDUE_WARNING] cho ${reportsToWarning.length} báo cáo (IDs: ${warningIds.join(', ')}).`);
    }

    this.logger.log('--- [CRON JOB] Hoàn thành quét kiểm tra thời hạn ---');
  }

  @Cron('1 0 * * *')
  async generateScheduledReports() {
    this.logger.log('--- [CRON JOB] Quét kỳ báo cáo đến hạn mở ---');
    const now = new Date();

    const reportTypes = await this.dataSource.getRepository(ReportType)
      .createQueryBuilder('rt')
      .where('rt.isActive = :isActive', { isActive: true })
      .andWhere('rt.startDate <= :now', { now })
      .getMany();

    if (reportTypes.length === 0) return;

    for (const rt of reportTypes) {
      const reportCount = await this.reportRepository.count({
        where: { reportTypeId: rt.id }
      });

      if (reportCount === 0) {
        this.logger.log(`➔ Đang khởi tạo báo cáo cho kỳ: [ID: ${rt.id}] ${rt.name}...`);
        
        const activeCompanies = await this.dataSource.getRepository(Doet).find({
          where: { status: true, deletedAt: IsNull() },
          select: { id: true },
        });

        if (activeCompanies.length > 0) {
          const autoReports = activeCompanies.map((company) =>
            this.reportRepository.create({
              title: `Báo cáo định kỳ - ${rt.name} (Tự động khởi tạo)`,
              year: rt.year,
              note: "",
              status: ReportStatus.DRAFT, 
              reportTypeId: rt.id,
              doetId: company.id,
              details: [],
            }),
          );

          await this.reportRepository.insert(autoReports);
          this.logger.log(`   + Đã tạo ${activeCompanies.length} báo cáo cho kỳ ${rt.name}`);
        }
      }
    }
  }
}