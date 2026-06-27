import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, In } from 'typeorm';
import { Report, ReportStatus } from './report.entity';

@Injectable()
export class ReportSchedulerService {
  private readonly logger = new Logger(ReportSchedulerService.name);

  constructor(
    @InjectRepository(Report)
    private readonly reportRepository: Repository<Report>,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async checkOverdueReports() {
    this.logger.log('--- [CRON JOB] Bắt đầu quét kiểm tra thời hạn báo cáo ---');
    const now = new Date();

    const reportsToOverdue = await this.reportRepository.createQueryBuilder('r')
      .leftJoinAndSelect('r.reportType', 'rt')
      .where('r.status IN (:...statuses)', { statuses: [ReportStatus.DRAFT, ReportStatus.OVERDUE_WARNING] })
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
}