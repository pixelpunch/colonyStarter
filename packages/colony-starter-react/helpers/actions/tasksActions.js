// import big number
import BN from 'bn.js'

// import extended protocol
import ecp from '../ecp'

// import local actions
import { getDomainTitle } from './domainsActions'
import { getSkillTitle } from './skillsActions'

// cancelTask

export const cancelTask = async (colonyClient, taskId) => {

  // cancel task
  await colonyClient.cancelTask.send({ taskId })

  // get updated task
  const updatedTask = await getTask(colonyClient, taskId)

  // get updated task extended
  const updatedTaskExtended = await getTaskExtended(colonyClient, updatedTask)

  // return updated task extended
  return updatedTaskExtended

}

// createTask

export const createTask = async (colonyClient, task) => {

  // initialize extended protocol
  await ecp.init()

  // create specification hash
  const specificationHash = await ecp.saveTaskSpecification(task.specification)

  // stop extended protocol
  await ecp.stop()

  // format domain id
  const domainId = Number(task.domainId)

  // create task
  const { eventData: { taskId }} = await colonyClient.createTask.send({
    domainId,
    specificationHash,
  })

  // check due date
  if (task.dueDate) {

    // format due date
    const dueDate = new Date(task.dueDate)

    // set task due date
    await setTaskDueDate(colonyClient, taskId, dueDate)

  }

  // check skill id
  if (task.skillId) {

    // format skillId
    const skillId = Number(task.skillId)

    // set task skill
    await setTaskSkill(colonyClient, taskId, skillId)

  }

  // check evaluator payout
  if (task.payouts.evaluator) {

    // set task evaluator payout
    await setTaskEvaluatorPayout(colonyClient, taskId, task.payouts.evaluator)

  }

  // check manager payout
  if (task.payouts.manager) {

    // set task manager payout
    await setTaskManagerPayout(colonyClient, taskId, task.payouts.manager)

  }

  // check worker payout
  if (task.payouts.worker) {

    // set task worker payout
    await setTaskWorkerPayout(colonyClient, taskId, task.payouts.worker)

  }

  // check evaluator
  if (task.roles.evaluator) {

    // set task role
    await setTaskRole(colonyClient, taskId, 'EVALUATOR', task.roles.evaluator)

  }

  // check manager
  if (task.roles.manager) {

    // set task role
    await setTaskRole(colonyClient, taskId, 'MANAGER', task.roles.manager)

  }

  // check worker
  if (task.roles.worker) {

    // set task role
    await setTaskRole(colonyClient, taskId, 'WORKER', task.roles.worker)

  }

  // get new task
  const newTask = await getTask(colonyClient, taskId)

  // get new task extended
  const newTaskExtended = await getTaskExtended(colonyClient, newTask)

  // return new task extended
  return newTaskExtended

}

// finalizeTask

export const finalizeTask = async (colonyClient, taskId) => {

  // finalize task
  await colonyClient.finalizeTask.send({ taskId })

  // get updated task
  const updatedTask = await getTask(colonyClient, taskId)

  // get updated task extended
  const updatedTaskExtended = await getTaskExtended(colonyClient, updatedTask)

  // return updated task extended
  return updatedTaskExtended

}

// fundTask

export const fundTask = async (colonyClient, taskId, amount) => {

  // set token
  const token = colonyClient.token._contract.address

  // get task
  const task = await getTask(colonyClient, taskId)

  // get task domain
  const domain = await colonyClient.getDomain.call({
    domainId: task.domainId,
  })

  // move funds between pots
  await colonyClient.moveFundsBetweenPots.send({
    fromPot: domain.potId,
    toPot: task.potId,
    amount: new BN(amount),
    token,
  })

  // get updated task extended
  const updatedTaskExtended = await getTaskExtended(colonyClient, task)

  // return updated task extended
  return updatedTaskExtended

}

// getRatings

export const getRatings = async (colonyClient, taskId) => {

  const { count, date } = await colonyClient.getTaskWorkRatings.call({ taskId })

  // return ratings
  return { count, date }

}

// getTask

export const getTask = async (colonyClient, taskId) => {

  // get task
  const task = await colonyClient.getTask.call({ taskId })

  // initialize extended protocol
  await ecp.init()

  // get specification from specification hash
  const specification = await ecp.getTaskSpecification(task.specificationHash)

  // stop extended protocol
  await ecp.stop()

  // get domain title
  const domainTitle = getDomainTitle(task.domainId)

  // get skill title
  const skillTitle = getSkillTitle(task.skillId)

  // return task
  return {
    ...task,
    domainTitle,
    skillTitle,
    specification: {
      description: specification.description,
      title: specification.title,
    },
  }

}

// getTaskExtended

export const getTaskExtended = async (colonyClient, task) => {

  // set task id
  const taskId = task.id

  // get evaluator
  const evaluator = await colonyClient.getTaskRole.call({
    taskId,
    role: 'EVALUATOR',
  })

  // get manager
  const manager = await colonyClient.getTaskRole.call({
    taskId,
    role: 'MANAGER',
  })

  // get worker
  const worker = await colonyClient.getTaskRole.call({
    taskId,
    role: 'WORKER',
  })

  // set pot id
  const potId = task.potId

  // set token
  const token = colonyClient.token._contract.address

  // get pot balance
  const potBalance = await colonyClient.getPotBalance.call({
    potId,
    token,
  })

  // get evaluator payout
  const evaluatorPayout = await colonyClient.getTaskPayout.call({
    taskId,
    role: 'EVALUATOR',
    token,
  })

  // get manager payout
  const managerPayout = await colonyClient.getTaskPayout.call({
    taskId,
    role: 'MANAGER',
    token,
  })

  // get worker payout
  const workerPayout = await colonyClient.getTaskPayout.call({
    taskId,
    role: 'WORKER',
    token,
  })

  // initialize extended protocol
  await ecp.init()

  // set deliverable
  let deliverable = { message: null }

  // check deliverable hash
  if (task.deliverableHash) {

    // get deliverable from deliverable hash
    deliverable = await ecp.getTaskDeliverable(task.deliverableHash)

  }

  // stop extended protocol
  await ecp.stop()

  // set ratings
  let ratings = { count: 0, date: null }

  // check deliverable
  if (deliverable) {

    // get ratings
    ratings = await getRatings(colonyClient, taskId)

  }

  // return task
  return {
    ...task,
    deliverable,
    payouts: {
      evaluator: evaluatorPayout.amount.toNumber(),
      manager: managerPayout.amount.toNumber(),
      worker: workerPayout.amount.toNumber(),
    },
    pot: {
      balance: potBalance.balance.toNumber(),
    },
    ratings,
    roles: {
      evaluator,
      manager,
      worker,
    },
  }

}

// getTasks

export const getTasks = async (colonyClient) => {

  // get task count
  const { count: taskCount } = await colonyClient.getTaskCount.call()

  // set task id
  let taskId = 1

  // set tasks
  let tasks = []

  // get tasks
  while (taskId <= taskCount) {

    // get task
    const task = await getTask(colonyClient, taskId)

    // add task to tasks
    tasks.push(task)

    // increment task id
    taskId++

  }

  // return tasks
  return tasks

}

// revealRating

export const revealRating = async (colonyClient, taskId, role, rating) => {

  // set salt
  const salt = 'secret'

  // set value
  const value = rating

  // generate secret
  const { secret } = await colonyClient.generateSecret.call({ salt, value })

  // reveal task work rating
  const revealTaskWorkRating = await colonyClient.revealTaskWorkRating.send({ taskId, role, rating, salt })

  // get updated task
  const updatedTask = await getTask(colonyClient, taskId)

  // get updated task extended
  const updatedTaskExtended = await getTaskExtended(colonyClient, updatedTask)

  // return updated task extended
  return updatedTaskExtended

}

// setTaskBrief

export const setTaskBrief = async (colonyClient, taskId, specification) => {

  // initialize extended protocol
  await ecp.init()

  // create specification hash
  const specificationHash = await ecp.saveTaskSpecification(specification)

  // stop extended protocol
  await ecp.stop()

  // start set task brief operation
  const setTaskBriefOperation = await colonyClient.setTaskBrief.startOperation({
    taskId,
    specificationHash,
  })

  // serialize operation into JSON format
  const setTaskBriefOperationJSON = setTaskBriefOperation.toJSON()

  // sign task brief
  await signTaskBrief(colonyClient, setTaskBriefOperationJSON)

  // return id
  return taskId

}

// setTaskDomain

export const setTaskDomain = async (colonyClient, taskId, domainId) => {

  // set task domain
  await colonyClient.setTaskDomain.send({ taskId, domainId })

  // return id
  return taskId

}

// setTaskDueDate

export const setTaskDueDate = async (colonyClient, taskId, dueDate) => {

  // start set task due date operation
  const setTaskDueDateOperation = await colonyClient.setTaskDueDate.startOperation({ taskId, dueDate })

  // check if required signees includes current user address
  if (setTaskDueDateOperation.requiredSignees.includes(colonyClient.adapter.wallet.address)) {

    // sign task due date operation
    await setTaskDueDateOperation.sign()

  }

  // check for missing signees
  if (setTaskDueDateOperation.missingSignees.length === 0) {

    // send task due date operation
    await setTaskDueDateOperation.send()

  } else {

    // serialize operation into JSON format
    const setTaskDueDateOperationJSON = setTaskDueDateOperation.toJSON()

    // save operation to local storage
    localStorage.setItem('setTaskDueDateOperationJSON', setTaskDueDateOperationJSON)

  }

  // return id
  return taskId

}

// setTaskEvaluatorPayout

export const setTaskEvaluatorPayout = async (colonyClient, taskId, amount) => {

  // start set task evaluator payout operation
  const setTaskEvaluatorPayout = await colonyClient.setTaskEvaluatorPayout.startOperation({
    taskId,
    token: colonyClient.token._contract.address,
    amount: new BN(amount),
  })

  // serialize operation into JSON format
  const setTaskEvaluatorPayoutJSON = setTaskEvaluatorPayout.toJSON()

  // sign task evaluator payout
  await signTaskEvaluatorPayout(colonyClient, setTaskEvaluatorPayoutJSON)

  // return id
  return taskId

}

// setTaskManagerPayout

export const setTaskManagerPayout = async (colonyClient, taskId, amount) => {

  // start set task manager payout
  await colonyClient.setTaskManagerPayout.send({
    taskId,
    token: colonyClient.token._contract.address,
    amount: new BN(amount),
  })

  // return id
  return taskId

}

// setTaskRole

export const setTaskRole = async (colonyClient, taskId, role, user) => {

  // set task role
  await colonyClient.setTaskRoleUser.send({ taskId, role, user })

  // return id
  return taskId

}

// setTaskSkill

export const setTaskSkill = async (colonyClient, taskId, skillId) => {

  // set task role
  await colonyClient.setTaskSkill.send({ taskId, skillId })

  // return id
  return taskId

}

// setTaskWorkerPayout

export const setTaskWorkerPayout = async (colonyClient, taskId, amount) => {

  // start set task worker payout operation
  const setTaskWorkerPayout = await colonyClient.setTaskWorkerPayout.startOperation({
    taskId,
    token: colonyClient.token._contract.address,
    amount: new BN(amount),
  })

  // serialize operation into JSON format
  const setTaskWorkerPayoutJSON = setTaskWorkerPayout.toJSON()

  // sign task worker payout
  await signTaskWorkerPayout(colonyClient, setTaskWorkerPayoutJSON)

  // return id
  return taskId

}

// signTask

export const signTask = async (colonyClient, taskId) => {

  // set address
  const address = colonyClient._contract.address

  // get JSON formatted task brief operation from local storage
  const setTaskBriefOperationJSON = localStorage.getItem('setTaskBriefOperationJSON')

  // get JSON formatted task due date operation from local storage
  const setTaskDueDateOperationJSON = localStorage.getItem('setTaskDueDateOperationJSON')

  // get JSON formatted task evaluator payout operation from local storage
  const setTaskEvaluatorPayoutOperationJSON = localStorage.getItem('setTaskEvaluatorPayoutOperationJSON')

  // get JSON formatted task worker payout operation from local storage
  const setTaskWorkerPayoutOperationJSON = localStorage.getItem('setTaskWorkerPayoutOperationJSON')

  // set setTaskBriefOperation
  const setTaskBriefOperation = JSON.parse(setTaskBriefOperationJSON)

  // set setTaskDueDateOperation
  const setTaskDueDateOperation = JSON.parse(setTaskDueDateOperationJSON)

  // set setTaskEvaluatorPayoutOperation
  const setTaskEvaluatorPayoutOperation = JSON.parse(setTaskEvaluatorPayoutOperationJSON)

  // set setTaskWorkerPayoutOperation
  const setTaskWorkerPayoutOperation = JSON.parse(setTaskWorkerPayoutOperationJSON)

  // check if task brief operation exists for contract and task
  if (
    setTaskBriefOperationJSON &&
    setTaskBriefOperation.payload.sourceAddress === address &&
    setTaskBriefOperation.payload.inputValues.taskId === taskId
  ) {

    // sign task brief
    await signTaskBrief(colonyClient, setTaskBriefOperationJSON)

  }

  // check if task due date operation exists for contract and task
  if (
    setTaskDueDateOperationJSON &&
    setTaskDueDateOperation.payload.sourceAddress === address &&
    setTaskDueDateOperation.payload.inputValues.taskId === taskId
  ) {

    // sign task due date
    await signTaskDueDate(colonyClient, setTaskDueDateOperationJSON)

  }

  // check if task evaluator payout operation exists for contract and task
  if (
    setTaskEvaluatorPayoutOperationJSON &&
    setTaskEvaluatorPayoutOperation.payload.sourceAddress === address &&
    setTaskEvaluatorPayoutOperation.payload.inputValues.taskId === taskId
  ) {

    // sign task evaluator payout
    await signTaskEvaluatorPayout(colonyClient, setTaskEvaluatorPayoutOperationJSON)

  }

  // check if task worker payout operation exists for contract and task
  if (
    setTaskWorkerPayoutOperationJSON &&
    setTaskWorkerPayoutOperation.payload.sourceAddress === address &&
    setTaskWorkerPayoutOperation.payload.inputValues.taskId === taskId
  ) {

    // sign task worker payout
    await signTaskWorkerPayout(colonyClient, setTaskWorkerPayoutOperationJSON)

  }

  // get updated task
  const updatedTask = await getTask(colonyClient, taskId)

  // get updated task extended
  const updatedTaskExtended = await getTaskExtended(colonyClient, updatedTask)

  // return updated task extended
  return updatedTaskExtended

}

// signTaskBrief

export const signTaskBrief = async (colonyClient, operationJSON) => {

  // restore operation
  const setTaskBriefOperation = await colonyClient.setTaskBrief.restoreOperation(operationJSON)

  // check if required signees includes current user address
  if (setTaskBriefOperation.requiredSignees.includes(colonyClient.adapter.wallet.address)) {

    // sign set task brief operation
    await setTaskBriefOperation.sign()

  }

  // check for missing signees
  if (setTaskBriefOperation.missingSignees.length === 0) {

    // send set task brief operation
    await setTaskBriefOperation.send()

    // remove local storage item
    localStorage.removeItem('setTaskBriefOperationJSON')

  } else {

    // serialize operation into JSON format
    const setTaskBriefOperationJSON = setTaskBriefOperation.toJSON()

    // save operation to local storage
    localStorage.setItem('setTaskBriefOperationJSON', setTaskBriefOperationJSON)

  }

  // return operation
  return setTaskBriefOperation

}

// signTaskDueDate

export const signTaskDueDate = async (colonyClient, operationJSON) => {

  // restore operation
  const setTaskDueDateOperation = await colonyClient.setTaskDueDate.restoreOperation(operationJSON)

  // check if required signees includes current user address
  if (setTaskDueDateOperation.requiredSignees.includes(colonyClient.adapter.wallet.address)) {

    // sign set task due date operation
    await setTaskDueDateOperation.sign()

  }

  // check for missing signees
  if (setTaskDueDateOperation.missingSignees.length === 0) {

    // send set task due date operation
    await setTaskDueDateOperation.send()

    // remove local storage item
    localStorage.removeItem('setTaskDueDateOperationJSON')

  } else {

    // serialize operation into JSON format
    const setTaskDueDateOperationJSON = setTaskDueDateOperation.toJSON()

    // save operation to local storage
    localStorage.setItem('setTaskDueDateOperationJSON', setTaskDueDateOperationJSON)

  }

  // return operation
  return setTaskDueDateOperation

}

// signTaskEvaluatorPayout

export const signTaskEvaluatorPayout = async (colonyClient, operationJSON) => {

  // restore operation
  const setTaskEvaluatorPayoutOperation = await colonyClient.setTaskEvaluatorPayout.restoreOperation(operationJSON)

  // check if required signees includes current user address
  if (setTaskEvaluatorPayoutOperation.requiredSignees.includes(colonyClient.adapter.wallet.address)) {

    // sign set task evaluator payout operation
    await setTaskEvaluatorPayoutOperation.sign()

  }

  // check for missing signees
  if (setTaskEvaluatorPayoutOperation.missingSignees.length === 0) {

    // send set task evaluator payout operation
    await setTaskEvaluatorPayoutOperation.send()

    // remove local storage item
    localStorage.removeItem('setTaskEvaluatorPayoutOperationJSON')

  } else {

    // serialize operation into JSON format
    const setTaskEvaluatorPayoutOperationJSON = setTaskEvaluatorPayoutOperation.toJSON()

    // save operation to local storage
    localStorage.setItem('setTaskEvaluatorPayoutOperationJSON', setTaskEvaluatorPayoutOperationJSON)

  }

  // return operation
  return setTaskEvaluatorPayoutOperation

}

// signTaskWorkerPayout

export const signTaskWorkerPayout = async (colonyClient, operationJSON) => {

  // restore operation
  const setTaskWorkerPayoutOperation = await colonyClient.setTaskWorkerPayout.restoreOperation(operationJSON)

  // check if required signees includes current user address
  if (setTaskWorkerPayoutOperation.requiredSignees.includes(colonyClient.adapter.wallet.address)) {

    // sign set task worker payout operation
    await setTaskWorkerPayoutOperation.sign()

  }

  // check for missing signees
  if (setTaskWorkerPayoutOperation.missingSignees.length === 0) {

    // send set task worker payout operation
    await setTaskWorkerPayoutOperation.send()

    // remove local storage item
    localStorage.removeItem('setTaskWorkerPayoutOperationJSON')

  } else {

    // serialize operation into JSON format
    const setTaskWorkerPayoutOperationJSON = setTaskWorkerPayoutOperation.toJSON()

    // save operation to local storage
    localStorage.setItem('setTaskWorkerPayoutOperationJSON', setTaskWorkerPayoutOperationJSON)

  }

  // return operation
  return setTaskWorkerPayoutOperation

}

// submitRating

export const submitRating = async (colonyClient, taskId, role, rating) => {

  // set salt
  const salt = 'secret'

  // set value
  const value = rating

  // generate secret
  const { secret } = await colonyClient.generateSecret.call({ salt, value })

  // submit task work rating
  const submitTaskWorkRating = await colonyClient.submitTaskWorkRating.send({ taskId, role, secret })

  // get updated task
  const updatedTask = await getTask(colonyClient, taskId)

  // get updated task extended
  const updatedTaskExtended = await getTaskExtended(colonyClient, updatedTask)

  // return updated task extended
  return updatedTaskExtended

}

// submitWork

export const submitWork = async (colonyClient, taskId, deliverable) => {

  // initialize extended protocol
  await ecp.init()

  // create deliverable hash
  const deliverableHash = await ecp.saveTaskDeliverable(deliverable)

  // stop extended protocol
  await ecp.stop()

  // submit task deliverable
  await colonyClient.submitTaskDeliverable.send({ taskId, deliverableHash })

  // get updated task
  const updatedTask = await getTask(colonyClient, taskId)

  // get updated task extended
  const updatedTaskExtended = await getTaskExtended(colonyClient, updatedTask)

  // return updated task extended
  return updatedTaskExtended

}

// updateTask

export const updateTask = async (colonyClient, task) => {

  // set id
  const taskId = task.id

  // check domain id
  if (task.domainId) {

    // format domain id
    const domainId = Number(task.domainId)

    // set task domain
    await setTaskDomain(colonyClient, taskId, domainId)

  }

  // check due date
  if (task.dueDate) {

    // format due date
    const dueDate = new Date(task.dueDate)

    // set task due date
    await setTaskDueDate(colonyClient, taskId, dueDate)

  }

  // check evaluator payout
  if (task.payouts.evaluator) {

    // set task evaluator payout
    await setTaskEvaluatorPayout(colonyClient, taskId, task.payouts.evaluator)

  }

  // check manager payout
  if (task.payouts.manager) {

    // set task manager payout
    await setTaskManagerPayout(colonyClient, taskId, task.payouts.manager)

  }

  // check worker payout
  if (task.payouts.worker) {

    // set task worker payout
    await setTaskWorkerPayout(colonyClient, taskId, task.payouts.worker)

  }

  // check evaluator
  if (task.roles.evaluator) {

    // set task role
    await setTaskRole(colonyClient, taskId, 'EVALUATOR', task.roles.evaluator)

  }

  // check manager
  if (task.roles.manager) {

    // set task role
    await setTaskRole(colonyClient, taskId, 'MANAGER', task.roles.manager)

  }

  // check worker
  if (task.roles.worker) {

    // set task role
    await setTaskRole(colonyClient, taskId, 'WORKER', task.roles.worker)

  }

  // check skill id
  if (task.skillId) {

    // format skillId
    const skillId = Number(task.skillId)

    // set task due date
    await setTaskSkill(colonyClient, taskId, skillId)

  }

  // check specification
  if (task.specification) {

    // set task brief
    await setTaskBrief(colonyClient, taskId, task.specification)

  }

  // get updated task
  const updatedTask = await getTask(colonyClient, taskId)

  // get updated task extended
  const updatedTaskExtended = await getTaskExtended(colonyClient, updatedTask)

  // return updated task extended
  return updatedTaskExtended

}
