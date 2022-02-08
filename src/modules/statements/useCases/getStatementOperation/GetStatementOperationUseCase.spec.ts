import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let usersRepository: InMemoryUsersRepository;
let statementsRepository: InMemoryStatementsRepository;
let getStatementOperation: GetStatementOperationUseCase;

describe('Get Statement Operation', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    statementsRepository = new InMemoryStatementsRepository();
    getStatementOperation = new GetStatementOperationUseCase(
      usersRepository,
      statementsRepository,
    );
  })

  it('should be able to get statement operation from user', async () => {
    const user = await usersRepository.create({
      name: 'Weickmam',
      email: 'weickmam@mail.io',
      password: '123456',
    });

    const deposit = await statementsRepository.create({
      user_id: user.id as string,
      amount: 1400,
      description: 'Job',
      type: OperationType.DEPOSIT,
    });

    const statement = await getStatementOperation.execute({
      user_id: user.id as string,
      statement_id: deposit.id as string,
    });

    expect(statement.user_id).toEqual(user.id);
    expect(statement.amount).toEqual(1400);
    expect(statement.type).toEqual(OperationType.DEPOSIT);
  });

  it('should not be able to get statement operation from non-existent user', () => {
    expect(async () => {
      await getStatementOperation.execute({
        user_id: 'non-existent',
        statement_id: '13131'
      })
    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound)
  });

  it('should not be able to get statement operation from non-existent statement', () => {
    expect(async () => {
      const user = await usersRepository.create({
        name: 'Weickmam',
        email: 'weickmam@mail.io',
        password: '123456',
      });

      await getStatementOperation.execute({
        user_id: user.id as string,
        statement_id: '13131'
      })
    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound)
  });
})
