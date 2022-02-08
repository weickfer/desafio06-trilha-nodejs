import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let statementsRepository: InMemoryStatementsRepository;
let usersRepository: InMemoryUsersRepository;
let getBalance: GetBalanceUseCase;

describe('Get Balance', () => {
  beforeEach(() => {
    statementsRepository = new InMemoryStatementsRepository();
    usersRepository = new InMemoryUsersRepository();
    getBalance = new GetBalanceUseCase(statementsRepository, usersRepository);
  });

  it('should be able to get balance', async () => {
    const user = await usersRepository.create({
      name: 'Weickmam',
      email: 'weickmam@mail.io',
      password: '123456',
    });

    const deposit = await statementsRepository.create({
      user_id: user.id as string,
      amount: 600,
      description: 'Emergency Aid',
      type: OperationType.DEPOSIT,
    });

    const withdraw = await statementsRepository.create({
      user_id: user.id as string,
      amount: 150,
      description: 'StarLink Internet Plan',
      type: OperationType.WITHDRAW,
    });

    const result = await getBalance.execute({
      user_id: user.id as string
    });

    expect(result).toHaveProperty('balance');
    expect(result.balance).toEqual(450);
    expect(result.statement).toEqual(expect.arrayContaining([deposit, withdraw]));
  });

  it('should not be able to get balance from non-existent user', () => {
    expect(async () => {
      await getBalance.execute({
        user_id: 'non-existent'
      })
    }).rejects.toBeInstanceOf(GetBalanceError);
  });
});
