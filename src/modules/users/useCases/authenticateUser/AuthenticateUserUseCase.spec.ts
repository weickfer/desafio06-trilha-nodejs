import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../createUser/CreateUserUseCase"
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase"
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError"


let usersRepository: InMemoryUsersRepository
let authenticateUser: AuthenticateUserUseCase
let createUser: CreateUserUseCase

describe('Create User', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    authenticateUser = new AuthenticateUserUseCase(usersRepository)
    createUser = new CreateUserUseCase(usersRepository)
  })

  it('should be able to authenticate user', async () => {
    const user = {
      name: 'Weickmam',
      email: 'weickmam@mail.io',
      password: '123456'
    }

    await createUser.execute(user)

    const session = await authenticateUser.execute(user)

    expect(session).toHaveProperty('token')
  })

  it('should not be able to authenticate a non-existent user', () => {
    expect(async () => {
      await authenticateUser.execute({
        email: 'no@exists.io',
        password: 'not-exist'
      })
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
  })

  it('should not be able to authenticate with invalid email', () => {
    expect(async () => {
      const user = {
        name: 'Weickmam',
        email: 'weickmam@mail.io',
        password: '123456'
      }

      await createUser.execute(user)

      await authenticateUser.execute({
        email: 'invalid@email.io',
        password: '123456'
      })
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
  })

  it('should not be able to authenticate with invalid password', () => {
    expect(async () => {
      const user = {
        name: 'Weickmam',
        email: 'weickmam@mail.io',
        password: '123456'
      }

      await createUser.execute(user)

      await authenticateUser.execute({
        email: 'weickmam@mail.io',
        password: 'invalid-password'
      })
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
  })
})
