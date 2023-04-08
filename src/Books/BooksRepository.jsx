import { injectable, inject } from 'inversify'
import { Config } from '../Core/Config'
import { makeObservable, observable } from 'mobx'
import { Types } from '../Core/Types'
import { UserModel } from '../Authentication/UserModel'
import { MessagePacking } from '../Core/Messages/MessagePacking'

@injectable()
class BooksRepository {
  baseUrl

  @inject(Types.IDataGateway)
  dataGateway

  @inject(UserModel)
  userModel

  @inject(Config)
  config

  messagePm = 'UNSET'

  constructor() {
    makeObservable(this, { messagePm: observable })
  }

  load = async () => {
    const dto = await this.dataGateway.get(`/books?emailOwnerId=${this.userModel.email}`)
    if (dto?.success) {
      this.messagePm = {
        success: dto.success,
        books: dto.result.map((book) => {
          return book
        })
      }
    }
    return this.messagePm
  }

  get = async (bookId) => {
    const path = `/book?emailOwnerId=${this.userModel.email}&bookId=${bookId}`
    const bookDto = await this.dataGateway.get(path)
    if (bookDto?.success) {
      this.messagePm = {
        success: bookDto.success,
        name: bookDto.result[0].name
      }
    }
    return this.messagePm
  }

  addBook = async (name) => {
    const requestDto = {
      name: name,
      emailOwnerId: 'a@b.com'
    }
    let responseDto = await this.dataGateway.post(`/books`, requestDto)
    return MessagePacking.unpackServerDtoToPm(responseDto)
  }

  reset = () => {
    this.messagePm = 'RESET'
  }
}

export { BooksRepository }
