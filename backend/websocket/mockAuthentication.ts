
type User = {
  username: string;
}

const mockUsers: User[] = [
  { username: 'alice' },
  { username: 'bob' },
  { username: 'charlie' },
  { username: 'dave' },
  { username: 'eve' },
  { username: 'michael'}
];

export const mockAuthentication = async (username: string):Promise<User | null> => {
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate async delay
  const user = mockUsers.find(u => u.username === username);
  if (!user) return null;
  return user;
}