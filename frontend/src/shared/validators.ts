import { getRouterPaths } from '~/shared/utils'

export function isEmpty(input: string) {
  return input.trim().length === 0
}

export type EmailValidationError = Exclude<
  ReturnType<EmailValidator['validate']>,
  null
>

export class EmailValidator {
  constructor(private readonly email: string) {}

  public validate() {
    if (isEmpty(this.email)) return 'empty'

    if (!this.isMinimalLengthValid() || !this.isSignatureValid())
      return 'invalid'

    return null
  }

  private isMinimalLengthValid() {
    return this.email.length >= 4
  }

  private isSignatureValid() {
    return this.email.includes('@') && this.email.includes('.')
  }
}

export class PasswordValidator {
  constructor(private readonly password: string) {}

  public validate() {
    if (isEmpty(this.password)) return 'empty'

    if (!this.isMinimalLengthValid()) return 'too_short'
    if (!this.isMaximumLengthValid()) return 'too_long'

    if (!this.hasLowerCase()) return 'no_lower_letter'
    if (!this.hasUpperCase()) return 'no_upper_letter'

    if (!this.hasDigit()) return 'no_digit'

    return null
  }

  private isMinimalLengthValid() {
    return this.password.length >= 8
  }

  private isMaximumLengthValid() {
    return this.password.length <= 32
  }

  private hasUpperCase() {
    const regexp = new RegExp('(?=.*[A-Z])')

    return regexp.test(this.password)
  }

  private hasLowerCase() {
    const regexp = new RegExp('(?=.*[a-z])')

    return regexp.test(this.password)
  }

  private hasDigit() {
    const regexp = new RegExp('(?=.*\\d)')

    return regexp.test(this.password)
  }
}

export type UsernameValidationError = Exclude<
  ReturnType<UsernameValidator['validate']>,
  null
>

export class UsernameValidator {
  constructor(private readonly username: string) {}

  public validate() {
    if (isEmpty(this.username)) return 'empty'
    if (!this.isMinimalLengthValid()) return 'too_short'
    if (!this.isMaximumLengthValid()) return 'too_long'

    if (this.containsForbiddenCharacters()) return 'forbidden_characters'

    if (this.hasConflictWithRouter()) return 'router_conflict'

    return null
  }

  private containsForbiddenCharacters() {
    const regexp = new RegExp('[!/@#$%^&*()+{}\\[\\]:;<>,.?~\\\\]')

    return regexp.test(this.username)
  }

  private isMinimalLengthValid() {
    return this.username.length >= 4
  }

  private isMaximumLengthValid() {
    return this.username.length <= 18
  }

  private hasConflictWithRouter() {
    return getRouterPaths().includes(this.username)
  }
}
