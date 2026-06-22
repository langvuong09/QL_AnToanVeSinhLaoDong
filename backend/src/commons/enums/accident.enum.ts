export enum AccidentCauseEnum {
  TECHNICAL = 'Kỹ thuật',
  UNSAFE_EQUIPMENT = 'Thiết bị không đảm bảo ATVSLĐ',
  LACK_OF_EQUIPMENT = 'Thiếu thiết bị ATVSLĐ',
  BROKEN_EQUIPMENT = 'Thiết bị ATVSLĐ hỏng',
  NOT_USING_EQUIPMENT = 'Không sử dụng thiết bị ATVSLĐ',
  VIOLATE_RULES = 'Vi phạm nội quy ATVSLĐ',
  OTHER = 'Khác'
}

export const AccidentCauseLabel: Record<AccidentCauseEnum, string> = {
  [AccidentCauseEnum.TECHNICAL]: 'Kỹ thuật',
  [AccidentCauseEnum.UNSAFE_EQUIPMENT]: 'Thiết bị không đảm bảo ATVSLĐ',
  [AccidentCauseEnum.LACK_OF_EQUIPMENT]: 'Thiếu thiết bị ATVSLĐ',
  [AccidentCauseEnum.BROKEN_EQUIPMENT]: 'Thiết bị ATVSLĐ hỏng',
  [AccidentCauseEnum.NOT_USING_EQUIPMENT]: 'Không sử dụng thiết bị ATVSLĐ',
  [AccidentCauseEnum.VIOLATE_RULES]: 'Vi phạm nội quy ATVSLĐ',
  [AccidentCauseEnum.OTHER]: 'Khác'
};