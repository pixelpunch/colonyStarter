const { default: ColonyNetworkClient, EMPTY_ADDRESS } = require('@colony/colony-js-client');
const BigNumber = require('bn.js');

const ecp = require('./ecp');

const example = async (colonyClient) => {
  // Initialise the Extended Colony Protocol

  await ecp.init();

  // Create a task!
  const specificationHash = await ecp.saveTaskSpecification({ title: 'Cool task', description: 'Create this cool thing.' });

  // Unique, immutable hash on IPFS
  console.log('Specification hash', specificationHash);

  // Create a task in the root domain
  const { eventData: { taskId }} = await colonyClient.createTask.send({ specificationHash, domainId: 1 });

  // Let's take a look at the newly created task
  const task = await colonyClient.getTask.call({ taskId });
  console.log(task);

  const oneEther = new BigNumber(1).mul(new BigNumber(10).pow(new BigNumber(18)));

  await colonyClient.moveFundsBetweenPots.send({ fromPot: 1, toPot: 2, amount: oneEther, token: EMPTY_ADDRESS })

  const { balance } = await colonyClient.getPotBalance.call({ potId: 2, token: EMPTY_ADDRESS });

  console.log(balance.toString())

  const ms = await colonyClient.setTaskWorkerPayout.startOperation({ taskId, token: EMPTY_ADDRESS, amount: oneEther });

  await ms.sign();
  console.log(ms.missingSignees);
  await ms.send();

  const msDueDate = await colonyClient.setTaskDueDate.startOperation({ taskId, dueDate: new Date(2019, 1, 1) });

  await msDueDate.sign();
  await msDueDate.send();

  const { address: workerAddress } = await colonyClient.adapter.loader.getAccount(0);

  await colonyClient.setTaskRoleUser.send({ taskId, role: 'WORKER', user: workerAddress });
  await colonyClient.setTaskRoleUser.send({ taskId, role: 'EVALUATOR', user: workerAddress });

  const { secret } = await colonyClient.generateSecret.call({ salt: 'secret', value: 3 });

  const deliverableHash = await ecp.saveTaskSpecification({ result: 'done' });

  await colonyClient.submitTaskDeliverable.send({ taskId, deliverableHash });

  await colonyClient.submitTaskWorkRating.send({
    taskId,
    role: 'MANAGER',
    secret,
  });

  await colonyClient.submitTaskWorkRating.send({
    taskId,
    role: 'WORKER',
    secret,
  });

  await colonyClient.revealTaskWorkRating.send({
    taskId,
    role: 'WORKER',
    rating: 3,
    salt: 'secret',
  });

  await colonyClient.revealTaskWorkRating.send({
    taskId,
    role: 'MANAGER',
    rating: 3,
    salt: 'secret',
  });

  await colonyClient.finalizeTask.send({ taskId });

  const taskFinalized = await colonyClient.getTask.call({ taskId });

  console.log(taskFinalized);

  const walletBalance = await colonyClient.adapter.wallet.getBalance();

  console.log('Balance before payout', walletBalance.toString());

  const { successful } = await colonyClient.claimPayout.send({
    taskId,
    role: 'WORKER',
    token: EMPTY_ADDRESS,
  });

  console.log(successful);

  const walletBalanceAfter = await colonyClient.adapter.wallet.getBalance();

  console.log('Balance after payout', walletBalanceAfter.toString());

  // Do some cleanup
  await ecp.stop();
}

module.exports = example;
