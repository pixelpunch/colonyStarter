import React from 'react'
import SkillSelector from '../../../containers/Manage/Tasks/SkillSelector'
import styles from './TaskForm.scss'

const TaskForm = ({ handleChange, task }) => (
  <div className={styles.container}>
    <div className={styles.field}>
      <label htmlFor="domainId">
        {'Domain:'}
      </label>
      <select id="domainId" onChange={handleChange} value={task.domainId}>
        <option value={0}>
          {'select domain...'}
        </option>
        <option value={2}>
          {'Business'}
        </option>
        <option value={3}>
          {'Education'}
        </option>
        <option value={4}>
          {'Service'}
        </option>
      </select>
    </div>
    <SkillSelector
      handleChange={handleChange}
      skillId={task.skillId}
    />
    <div className={styles.field}>
      <label htmlFor="specification-title">
        {'Title:'}
      </label>
      <input
        id="specification-title"
        onChange={handleChange}
        placeholder="task title"
        type="text"
        value={task.specification.title}
      />
    </div>
    <div className={styles.field}>
      <label htmlFor="specification-description">
        {'Description:'}
      </label>
      <input
        id="specification-description"
        onChange={handleChange}
        placeholder="task description"
        type="text"
        value={task.specification.description}
      />
    </div>
    <div className={styles.field}>
      <label htmlFor="dueDate">
        {'Due date:'}
      </label>
      <input
        id="dueDate"
        onChange={handleChange}
        type="date"
        value={task.dueDate}
      />
    </div>
    <div className={styles.field}>
      <label htmlFor="role-manager">
        {'Manager:'}
      </label>
      <input
        id="role-manager"
        onChange={handleChange}
        placeholder="0x0"
        type="text"
        value={task.roles.manager}
      />
    </div>
    <div className={styles.field}>
      <label htmlFor="role-evaluator">
        {'Evaluator:'}
      </label>
      <input
        id="role-evaluator"
        onChange={handleChange}
        placeholder="0x0"
        type="text"
        value={task.roles.evaluator}
      />
    </div>
    <div className={styles.field}>
      <label htmlFor="role-worker">
        {'Worker:'}
      </label>
      <input
        id="role-worker"
        onChange={handleChange}
        placeholder="0x0"
        type="text"
        value={task.roles.worker}
      />
    </div>
    <div className={styles.field}>
      <label htmlFor="payout-manager">
        {'Manager Payout:'}
      </label>
      <input
        id="payout-manager"
        onChange={handleChange}
        placeholder="0"
        type="number"
        value={task.payouts.manager}
      />
    </div>
    <div className={styles.field}>
      <label htmlFor="payout-evaluator">
        {'Evaluator Payout:'}
      </label>
      <input
        id="payout-evaluator"
        onChange={handleChange}
        placeholder="0"
        type="number"
        value={task.payouts.evaluator}
      />
    </div>
    <div className={styles.field}>
      <label htmlFor="payout-worker">
        {'Worker Payout:'}
      </label>
      <input
        id="payout-worker"
        onChange={handleChange}
        placeholder="0"
        type="number"
        value={task.payouts.worker}
      />
    </div>
  </div>
)

export default TaskForm
