import React from 'react'
import { NavLink } from 'react-router-dom'
import styles from './Menu.scss'

const Menu = ({ logout }) => (
  <div className={styles.menu}>
    <ul className={styles.list}>
      <li className={styles.item}>
        <NavLink to="/manage">
          {'Home'}
        </NavLink>
      </li>
      <li className={styles.item}>
        <NavLink to="/manage/admins">
          {'Admins'}
        </NavLink>
      </li>
      <li className={styles.item}>
        <NavLink to="/manage/funds">
          {'Funds'}
        </NavLink>
      </li>
      <li className={styles.item}>
        <NavLink to="/manage/tasks">
          {'Tasks'}
        </NavLink>
      </li>
      <li className={styles.item}>
        <NavLink to="/manage/token">
          {'Token'}
        </NavLink>
      </li>
      <li className={styles.item}>
        <a onClick={logout}>
          {'Logout'}
        </a>
      </li>
    </ul>
  </div>
)

export default Menu
