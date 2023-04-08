import { injectable, inject } from 'inversify'
import { Config } from '../Core/Config'
import { makeObservable, observable } from 'mobx'
import { Types } from '../Core/Types'
import { UserModel } from '../Authentication/UserModel'
import { BooksRepository } from '../Books/BooksRepository'
// import { MessagePacking } from '../Core/Messages/MessagePacking'

@injectable()
class AuthorsRepository {
  baseUrl

  @inject(Types.IDataGateway)
  dataGateway

  @inject(BooksRepository)
  booksRepository

  @inject(UserModel)
  userModel

  @inject(Config)
  config

  messagePm = 'UNSET'

  constructor() {
    makeObservable(this, { messagePm: observable })
  }

  load = async () => {
    const dto = await this.dataGateway.get(`/authors?emailOwnerId=${this.userModel.email}`)
    if (dto?.success) {
      // 1. fetch all bookIds from all the authors
      let bookIds = []
      dto.result.forEach((author) => {
        bookIds = bookIds.concat(author.bookIds)
      })

      // 2. fetch bookNames from bookIds concurrently using Promise.all
      const books = await Promise.all(
        bookIds.map(async (bookId) => {
          const bookDto = await this.booksRepository.get(bookId)
          return {
            bookId,
            name: bookDto.name
          }
        })
      )

      // 3. cache bookId key and bookName value
      const bookNamesObj = {}
      books.forEach((book) => {
        bookNamesObj[book.bookId] = book.name
      })

      // 4. create authors obj with author name and all corresponding bookNames
      const authors = []
      dto.result.forEach((author) => {
        const bookNames = author.bookIds.map((bookId) => {
          return bookNamesObj[bookId]
        })
        authors.push({
          name: author.name,
          bookNames
        })
      })

      // 5. save to Programmer's Model
      this.messagePm = {
        success: dto.success,
        authors
      }
    }
    return this.messagePm
  }

  // addAuthor = async (name) => {
  //   const requestDto = {
  //     name: name,
  //     emailOwnerId: 'a@b.com',
  //     latLon: [1, 2],
  //     bookIds: [1, 2]
  //   }
  //   let responseDto = await this.dataGateway.post(`/authors`, requestDto)
  //   return MessagePacking.unpackServerDtoToPm(responseDto)
  // }

  reset = () => {
    this.messagePm = 'RESET'
  }
}
export { AuthorsRepository }
