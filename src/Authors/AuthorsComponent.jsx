import * as React from 'react'
import { observer } from 'mobx-react'
import { withInjection } from '../Core/Providers/Injection'
import { AuthorsPresenter } from './AuthorsPresenter'
import { AuthorListComponent } from './AuthorListComponent'

const AuthorsComp = observer((props) => {
  return (
    <>
      <h1>AUTHORS</h1>
      <br />
      <AuthorListComponent />
    </>
  )
})

export const AuthorsComponent = withInjection({ presenter: AuthorsPresenter })(AuthorsComp)
