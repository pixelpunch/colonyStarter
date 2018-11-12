import React from 'react'
import styles from './FundTask.scss'

const FundTask = ({
  amount,
  fundTaskError,
  fundTaskLoading,
  fundTaskSuccess,
  handleChange,
  handleClick,
}) => (
  <div className={styles.container}>
    <h2>{'Fund Task'}</h2>
    <div className={styles.field}>
      <label htmlFor="amount">
        {'amount:'}
      </label>
      <input
        id="amount"
        onChange={handleChange}
        type="number"
        value={amount}
      />
    </div>
    <div className={styles.buttons}>
      <button onClick={handleClick}>
        {'Fund Task'}
      </button>
    </div>
    {fundTaskError &&
      <div className={styles.message}>
        <span className={styles.error}>
          {fundTaskError}
        </span>
      </div>
    }
    {fundTaskLoading &&
      <div className={styles.message}>
        <span>
          {'loading...'}
        </span>
      </div>
    }
    {fundTaskSuccess &&
      <div className={styles.message}>
        <span>
          {'success'}
        </span>
      </div>
    }
  </div>
)

export default FundTask
