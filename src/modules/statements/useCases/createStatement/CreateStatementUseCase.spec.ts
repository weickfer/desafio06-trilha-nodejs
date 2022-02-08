import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

let usersRepository: InMemoryUsersRepository;
let statementsRepository: InMemoryStatementsRepository;
let createStatement: CreateStatementUseCase;

describe('Create Statement', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    statementsRepository = new InMemoryStatementsRepository();
    createStatement = new CreateStatementUseCase(usersRepository, statementsRepository);
  })

  it('should be able to do deposit statement', async () => {
    const user = await usersRepository.create({
      name: 'Weickmam',
      email: 'weickmam@mail.io',
      password: '123456',
    });

    const statement = await createStatement.execute({
      user_id: user.id as string,
      amount: 200,
      description: 'description',
      type: OperationType.DEPOSIT,
    });

    expect(statement).toHaveProperty('id');
    expect(statement.user_id).toEqual(user.id);
    expect(statement.amount).toEqual(200);
    expect(statement.type).toEqual(OperationType.DEPOSIT);
  })

  it('should not be possible to do withdraw statement from user with insufficient funds', () => {
    expect(async () => {
      const user = await usersRepository.create({
        name: 'Weickmam',
        email: 'weickmam@mail.io',
        password: '123456',
      });

      await createStatement.execute({
        user_id: user.id as string,
        amount: 200,
        description: 'description',
        type: OperationType.WITHDRAW,
      });
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds)
  });

  it('should not be able to do deposit statement on a non-existent user', () => {
    expect(async () => {
      await createStatement.execute({
        user_id: 'non-existent',
        amount: 200,
        description: 'description',
        type: OperationType.DEPOSIT,
      });
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
  });
});
