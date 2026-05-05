export class User {
  constructor(
    public readonly id: number,
    public readonly name: string,
  ) { }

  static create({id, name}: { id: number, name: string }): User {
    return new User(
      id,
      name
    )
  }
}
