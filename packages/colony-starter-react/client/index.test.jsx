import React from 'react'
import { createStore } from 'redux'
import { BrowserRouter, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import renderer from 'react-test-renderer'
import middleware from './middleware'
import reducers from './reducers'
import App from './containers/App'

// Mock react-dom for testing
jest.mock('react-dom', () => ({
  render: () => null,
  unmountComponentAtNode: () => null,
  findDOMNode: () => {},
}))

// Testing Colony Starter React
describe('Colony Starter React', () => {

  // Create store using reducers and middleware
  const store = createStore(reducers, middleware)

  // Test if application renders
  test('Application renders', () => {
    const app = renderer.create(
      <Provider store={store}>
        <BrowserRouter>
          <Route path="/" component={App} />
        </BrowserRouter>
      </Provider>,
    )
    expect(app.toJSON()).toMatchSnapshot()
  })

})
