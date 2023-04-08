import { injectable, inject } from 'inversify'
import { makeObservable, computed } from 'mobx'
import { AuthorsRepository } from './AuthorsRepository'
import { MessagesPresenter } from '../Core/Messages/MessagesPresenter'

@injectable()
class AuthorsPresenter extends MessagesPresenter {
  @inject(AuthorsRepository)
  authorsRepository

  newBookName = null

  lastAddedBook = null

  load = async () => {
    await this.authorsRepository.load()
  }

  get viewModel() {
    const messagePm = this.authorsRepository.messagePm
    if (messagePm.success) {
      return messagePm.authors.map((author) => {
        return { visibleAuthor: `(${author.name}) | (${author.bookNames.join(',')})` }
      })
    } else {
      return []
    }
  }

  constructor() {
    super()
    makeObservable(this, {
      viewModel: computed
    })
  }

  // addAuthor = async () => {
  //   const authorPm = await this.authorsRepository.addAuthor(this.newBookName)
  //   if (authorPm.success) {
  //     this.lastAddedBook = this.newBookName
  //   }
  //   this.unpackRepositoryPmToVm(authorPm, 'Author added')
  // }

  reset = () => {
    this.newBookName = ''
  }
}
export { AuthorsPresenter }
