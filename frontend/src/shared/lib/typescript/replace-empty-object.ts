import { EmptyObject } from 'atomic-router'

export type ReplaceEmptyObject<
  T,
  OnEmpty = void,
  OnFilled = void,
> = T extends EmptyObject ? OnEmpty : OnFilled extends void ? T : OnFilled
