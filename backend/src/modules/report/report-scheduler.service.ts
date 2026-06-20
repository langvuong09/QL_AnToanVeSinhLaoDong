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

    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 5); 

    const reportsToWarning = await this.reportRepository.createQueryBuilder('r')
      .leftJoinAndSelect('r.reportType', 'rt')
      .where('r.status = :status', { status: ReportStatus.DRAFT })
      .andWhere('rt.endDate <= :targetDate', { targetDate })
      .andWhere('rt.endDate >= :now', { now: new Date() }) 
      .getMany();

    if (reportsToWarning.length === 0) {
      this.logger.log('Không có báo cáo nào chuẩn bị hết hạn.');
      return;
    }

    const updatedIds = reportsToWarning.map(r => r.id);
    await this.reportRepository.update(
      { id: In(updatedIds) },
      { status: ReportStatus.OVERDUE_WARNING }
    );

    this.logger.log(`Đã chuyển trạng thái [OVERDUE_WARNING] cho ${reportsToWarning.length} bản báo cáo (IDs: ${updatedIds.join(', ')}).`);
  }
}