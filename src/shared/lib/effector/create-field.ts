import {
  createEvent,
  createStore,
  Event,
  sample,
  StoreWritable,
  Unit,
} from 'effector'
import { match, P } from 'ts-pattern'

type UnknownUnit = Unit<unknown>[] | Unit<unknown>

type Validate<Value, Error, ValidationError> = {
  on: Event<void>
} & (
  | {
      type: 'class'
      Class: new (value: Value) => { validate: () => Error | null }
    }
  | {
      type: 'class-with-convertor'
      Class: new (value: Value) => { validate: () => ValidationError | null }
      convert: (error: ValidationError | null) => Error | null
    }
  | {
      type: 'function'
      fn: (value: Value) => Error | null
    }
)

interface CreateField<Value, Error, ValidationError> {
  defaultValue: Value
  $relatedStore?: StoreWritable<Value>
  changeReducer?: (event: Value, store: Value) => Value
  validate?: Validate<Value, Error, ValidationError>
  reset?: Partial<Record<'all' | 'error' | 'value', UnknownUnit>>
}

export function createField<Value, Error, ValidationError = unknown>(
  options: CreateField<Value, Error, ValidationError>,
) {
  const changed = createEvent<Value>()
  const $value = createStore(options.defaultValue)
  const $error = createStore<Error | null>(null)

  $value.on(changed, options.changeReducer ?? ((_, value) => value))

  if (options.$relatedStore) {
    options.$relatedStore.on($value, (_, value) => value)
  }

  changed(options.defaultValue) // Обноваление значения привязанного стора

  if (options.validate) {
    sample({
      clock: options.validate.on,
      source: $value,
      fn: match(options.validate)
        .with({ type: 'function', fn: P.select() }, (fn) => fn)
        .with(
          { type: 'class', Class: P.select() },
          (Class) => (value: Value) => {
            const validator = new Class(value)
            return validator.validate()
          },
        )
        .with(
          {
            type: 'class-with-convertor',
            Class: P.select('Class'),
            convert: P.select('convert'),
          },
          (selections) => (value: Value) => {
            const validator = new selections.Class(value)
            return selections.convert(validator.validate())
          },
        )
        .exhaustive(),
      target: $error,
    })
  }

  if (options.reset) {
    if (options.reset.all) {
      $value.reset(options.reset.all as Unit<unknown>)
      $error.reset(options.reset.all as Unit<unknown>)
    }

    if (options.reset.value) {
      $value.reset(options.reset.value as Unit<unknown>)
    }

    if (options.reset.error) {
      $error.reset(options.reset.error as Unit<unknown>)
    }
  }

  return { $value, $error, changed } as const
}
