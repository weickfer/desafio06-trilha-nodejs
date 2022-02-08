import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserError } from "./CreateUserError"
import { CreateUserUseCase } from "./CreateUserUseCase"

let usersRepository: InMemoryUsersRepository
let createUser: CreateUserUseCase

const user =

  describe('Create User', () => {
    beforeEach(() => {
      usersRepository = new InMemoryUsersRepository()
      createUser = new CreateUserUseCase(usersRepository)
    })

    it('should be able to register new user', async () => {
      const user = await createUser.execute({
        name: 'Weickmam',
        email: 'weickmam@mail.io',
        password: 'senha'
      })

      expect(user).toHaveProperty('id')
      expect(user.email).toEqual('weickmam@mail.io')
    })

    it('should not be able to register user with duplicated email', () => {
      expect(async () => {
        const user = {
          name: 'Weickmam',
          email: 'weickmam@mail.io',
          password: '1234567'
        }

        await usersRepository.create(user)
        await createUser.execute(user)
      }).rejects.toBeInstanceOf(CreateUserError)
    })
  })
