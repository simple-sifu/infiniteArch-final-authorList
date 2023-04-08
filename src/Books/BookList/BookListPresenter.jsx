import { injectable, inject } from 'inversify'
import { makeObservable, computed } from 'mobx'
import { BooksRepository } from '../BooksRepository'

@injectable()
class BookListPresenter {
  @inject(BooksRepository)
  booksRepository

  get viewModel() {
    const messagePm = this.booksRepository.messagePm
    if (messagePm.success) {
      return messagePm.books.map((book) => {
        return { visibleName: book.name }
      })
    } else {
      return []
    }
  }

  constructor() {
    makeObservable(this, {
      viewModel: computed
    })
  }
}
export { BookListPresenter }
