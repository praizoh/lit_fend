import { BigNumber, utils } from 'ethers';
import { v4 as uuidv4 } from 'uuid';
// import {
//     useAccount,
//     useSigner,
//     useDisconnect,
//     useEnsAvatar,
//     useEnsName,
//     useSignMessage,
//   } from "wagmi";

import { client, CreatePost } from "../api";
// const { data: signer } = useSigner({
//     onError(error) {
//       console.log("Error", error);
//     },
//   });
//   const { data: signer, isError, isLoading } = useSigner()

export const createPostTypedData = async (request) => {
    const result = await client
    .mutation(CreatePost, {
      ...request
    })
    .toPromise();
  console.log(profile);

  return result.data.createPostTypedData;
};

export const signedTypeData = (
    domain,
    types,
    value
  ) => {
    // const signer = getSigner();
    // remove the __typedname from the signature!
    return signer._signTypedData(
      omit(domain, '__typename'),
      omit(types, '__typename'),
      omit(value, '__typename')
    );
};

export const splitSignature = (signature) => {
    return utils.splitSignature(signature);
};

export const signCreatePostTypedData = async (request) => {
  const result = await createPostTypedData(request);
  console.log('create post: createPostTypedData', result);

  const typedData = result.typedData;
  console.log('create post: typedData', typedData);

  const signature = await signedTypeData(typedData.domain, typedData.types, typedData.value);
  console.log('create post: signature', signature);

  return { result, signature };
};

export const createPost = async (profileId) => {
  if (!profileId) {
    throw new Error('Must login with profile');
  }

//   const ipfsResult = await uploadIpfs<Metadata>({
//     version: '2.0.0',
//     mainContentFocus: PublicationMainFocus.TEXT_ONLY,
//     metadata_id: uuidv4(),
//     description: 'Description',
//     locale: 'en-US',
//     content: 'Content',
//     external_url: null,
//     image: null,
//     imageMimeType: null,
//     name: 'Name',
//     attributes: [],
//     tags: ['using_api_examples'],
//     appId: 'api_examples_github',
//   });
//   console.log('create post: ipfs result', ipfsResult);

  // hard coded to make the code example clear
  const createPostRequest = {
    profileId,
    // contentURI: `ipfs://${ipfsResult.path}`,
    contentURI: "ipfs://QmPogtffEF3oAbKERsoR4Ky8aTvLgBF5totp5AuF8YN6vl",
    collectModule: {
      // feeCollectModule: {
      //   amount: {
      //     currency: currencies.enabledModuleCurrencies.map(
      //       (c: any) => c.address
      //     )[0],
      //     value: '0.000001',
      //   },
      //   recipient: address,
      //   referralFee: 10.5,
      // },
      // revertCollectModule: true,
      freeCollectModule: { followerOnly: true },
      // limitedFeeCollectModule: {
      //   amount: {
      //     currency: '0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889',
      //     value: '2',
      //   },
      //   collectLimit: '20000',
      //   recipient: '0x3A5bd1E37b099aE3386D13947b6a90d97675e5e3',
      //   referralFee: 0,
      // },
    },
    referenceModule: {
      followerOnlyReferenceModule: false,
    },
  };

  const signedResult = await signCreatePostTypedData(createPostRequest);
  console.log('create post: signedResult', signedResult);

  const typedData = signedResult.result.typedData;

  const { v, r, s } = splitSignature(signedResult.signature);

  const tx = await lensHub.postWithSig({
    profileId: typedData.value.profileId,
    contentURI: typedData.value.contentURI,
    collectModule: typedData.value.collectModule,
    collectModuleInitData: typedData.value.collectModuleInitData,
    referenceModule: typedData.value.referenceModule,
    referenceModuleInitData: typedData.value.referenceModuleInitData,
    sig: {
      v,
      r,
      s,
      deadline: typedData.value.deadline,
    },
  });
  console.log('create post: tx hash', tx.hash);

  console.log('create post: poll until indexed');
  const indexedResult = await pollUntilIndexed({ txHash: tx.hash });

  console.log('create post: profile has been indexed');

  const logs = indexedResult.txReceipt.logs;

  console.log('create post: logs', logs);

  const topicId = utils.id(
    'PostCreated(uint256,uint256,string,address,bytes,address,bytes,uint256)'
  );
  console.log('topicid we care about', topicId);

  const profileCreatedLog = logs.find((l) => l.topics[0] === topicId);
  console.log('create post: created log', profileCreatedLog);

  let profileCreatedEventLog = profileCreatedLog.topics;
  console.log('create post: created event logs', profileCreatedEventLog);

  const publicationId = utils.defaultAbiCoder.decode(['uint256'], profileCreatedEventLog[2])[0];

  console.log('create post: contract publication id', BigNumber.from(publicationId).toHexString());
  console.log(
    'create post: internal publication id',
    profileId + '-' + BigNumber.from(publicationId).toHexString()
  );
};