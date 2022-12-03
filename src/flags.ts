export const PRIMITIVE_PARTITION = 0x1;
export const COMPOSED_PARTITION = 0x2;
export const SELECT_PARTITION = 0x4;
export const UPDATE_PARTITION = 0x8;

export const STATEFUL_PARTITION = PRIMITIVE_PARTITION | COMPOSED_PARTITION;

export const READ_WRITE_PARTITION = PRIMITIVE_PARTITION | COMPOSED_PARTITION;
export const READ_ONLY_PARTITION = SELECT_PARTITION;
export const WRITE_ONLY_PARTITION = UPDATE_PARTITION;

export const PARTITION =
  READ_WRITE_PARTITION | READ_ONLY_PARTITION | READ_WRITE_PARTITION;
