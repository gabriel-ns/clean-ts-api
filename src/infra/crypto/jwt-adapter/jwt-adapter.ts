import jwt from 'jsonwebtoken'
import { Decrypter } from '../../../data/protocols/crypto/decrypter'
import { Encrypter } from '../../../data/protocols/crypto/encrypter'

export class JwtAdapter implements Encrypter, Decrypter {
  constructor (
    private readonly secret: string
  ) {}

  async encrypt (value: string): Promise<string> {
    const accessToken = await jwt.sign({ id: value }, this.secret)
    return accessToken
  }

  async decrypt (value: string): Promise<string> {
    await jwt.verify(value, this.secret)
    return new Promise(resolve => resolve(null))
  }
}
