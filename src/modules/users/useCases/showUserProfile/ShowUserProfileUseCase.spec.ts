import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let usersRepository: InMemoryUsersRepository;
let showUserProfile: ShowUserProfileUseCase;

describe('Show User Profile', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    showUserProfile = new ShowUserProfileUseCase(usersRepository);
  });

  it('should be able to get user profile', async () => {
    const user = await usersRepository.create({
      name: 'Weickmam',
      email: 'weickmam@mail.io',
      password: '123456'
    });

    const profile = await showUserProfile.execute(user.id as string);

    expect(profile.id).toEqual(user.id);
    expect(profile).toHaveProperty('email')
  });

  it('should not be able to get profile a non-existent user', () => {
    expect(async () => {
      await showUserProfile.execute('non-existent-id')
    }).rejects.toBeInstanceOf(ShowUserProfileError)
  })
});
