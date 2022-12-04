// import { ApolloClient, InMemoryCache, gql } from '@apollo/client'

// const API_URL = 'https://api.lens.dev'

// /* create the API client */
// export const client = new ApolloClient({
//   uri: API_URL,
//   cache: new InMemoryCache()
// })

import { createClient } from 'urql';
import { userService } from './services/userService'

console.log(userService)
const APIURL = "https://api-mumbai.lens.dev";
// const APIURL = "https://api.lens.dev";

export const client = new createClient({
  url: APIURL,
  fetchOptions: () => {
    const token = userService ? userService.userValue.accessToken : '';
    return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  },

});

/* define a GraphQL query  */
// export const explorePublications = `
// query Publications {
//   profileId: "0x01",
//   publications(request: {
//     publicationTypes: [POST],
//     limit: 20,
//     metadata: {
//         mainContentFocus: [IMAGE, VIDEO]
//     }
//   }) {
//     items {
//       __typename 
//       ... on Post {
//         ...PostFields
//       }
//       ... on Comment {
//         ...CommentFields
//       }
//       ... on Mirror {
//         ...MirrorFields
//       }
//     }
//     pageInfo {
//       prev
//       next
//       totalCount
//     }
//   }
// }

// fragment MediaFields on Media {
//   url
//   mimeType
// }

// fragment ProfileFields on Profile {
//   id
//   name
//   bio
//   attributes {
//      displayType
//      traitType
//      key
//      value
//   }
//   isFollowedByMe
//   isFollowing(who: null)
//   followNftAddress
//   metadata
//   isDefault
//   handle
//   picture {
//     ... on NftImage {
//       contractAddress
//       tokenId
//       uri
//       verified
//     }
//     ... on MediaSet {
//       original {
//         ...MediaFields
//       }
//     }
//   }
//   coverPicture {
//     ... on NftImage {
//       contractAddress
//       tokenId
//       uri
//       verified
//     }
//     ... on MediaSet {
//       original {
//         ...MediaFields
//       }
//     }
//   }
//   ownedBy
//   dispatcher {
//     address
//   }
//   stats {
//     totalFollowers
//     totalFollowing
//     totalPosts
//     totalComments
//     totalMirrors
//     totalPublications
//     totalCollects
//   }
//   followModule {
//     ...FollowModuleFields
//   }
// }

// fragment PublicationStatsFields on PublicationStats { 
//   totalAmountOfMirrors
//   totalAmountOfCollects
//   totalAmountOfComments
//   totalUpvotes
//   totalDownvotes
// }

// fragment MetadataOutputFields on MetadataOutput {
//   name
//   description
//   content
//   media {
//     original {
//       ...MediaFields
//     }
//   }
//   attributes {
//     displayType
//     traitType
//     value
//   }
// }

// fragment Erc20Fields on Erc20 {
//   name
//   symbol
//   decimals
//   address
// }

// fragment PostFields on Post {
//   id
//   profile {
//     ...ProfileFields
//   }
//   stats {
//     ...PublicationStatsFields
//   }
//   metadata {
//     ...MetadataOutputFields
//   }
//   createdAt
//   collectModule {
//     ...CollectModuleFields
//   }
//   referenceModule {
//     ...ReferenceModuleFields
//   }
//   appId
//   hidden
//   reaction(request: null)
//   mirrors(by: null)
//   hasCollectedByMe
// }

// fragment MirrorBaseFields on Mirror {
//   id
//   profile {
//     ...ProfileFields
//   }
//   stats {
//     ...PublicationStatsFields
//   }
//   metadata {
//     ...MetadataOutputFields
//   }
//   createdAt
//   collectModule {
//     ...CollectModuleFields
//   }
//   referenceModule {
//     ...ReferenceModuleFields
//   }
//   appId
//   hidden
//   reaction(request: null)
//   hasCollectedByMe
// }

// fragment MirrorFields on Mirror {
//   ...MirrorBaseFields
//   mirrorOf {
//    ... on Post {
//       ...PostFields          
//    }
//    ... on Comment {
//       ...CommentFields          
//    }
//   }
// }

// fragment CommentBaseFields on Comment {
//   id
//   profile {
//     ...ProfileFields
//   }
//   stats {
//     ...PublicationStatsFields
//   }
//   metadata {
//     ...MetadataOutputFields
//   }
//   createdAt
//   collectModule {
//     ...CollectModuleFields
//   }
//   referenceModule {
//     ...ReferenceModuleFields
//   }
//   appId
//   hidden
//   reaction(request: null)
//   mirrors(by: null)
//   hasCollectedByMe
// }

// fragment CommentFields on Comment {
//   ...CommentBaseFields
//   mainPost {
//     ... on Post {
//       ...PostFields
//     }
//     ... on Mirror {
//       ...MirrorBaseFields
//       mirrorOf {
//         ... on Post {
//            ...PostFields          
//         }
//         ... on Comment {
//            ...CommentMirrorOfFields        
//         }
//       }
//     }
//   }
// }

// fragment CommentMirrorOfFields on Comment {
//   ...CommentBaseFields
//   mainPost {
//     ... on Post {
//       ...PostFields
//     }
//     ... on Mirror {
//        ...MirrorBaseFields
//     }
//   }
// }

// fragment FollowModuleFields on FollowModule {
//   ... on FeeFollowModuleSettings {
//     type
//     amount {
//       asset {
//         name
//         symbol
//         decimals
//         address
//       }
//       value
//     }
//     recipient
//   }
//   ... on ProfileFollowModuleSettings {
//     type
//     contractAddress
//   }
//   ... on RevertFollowModuleSettings {
//     type
//     contractAddress
//   }
//   ... on UnknownFollowModuleSettings {
//     type
//     contractAddress
//     followModuleReturnData
//   }
// }

// fragment CollectModuleFields on CollectModule {
//   __typename
//   ... on FreeCollectModuleSettings {
//     type
//     followerOnly
//     contractAddress
//   }
//   ... on FeeCollectModuleSettings {
//     type
//     amount {
//       asset {
//         ...Erc20Fields
//       }
//       value
//     }
//     recipient
//     referralFee
//   }
//   ... on LimitedFeeCollectModuleSettings {
//     type
//     collectLimit
//     amount {
//       asset {
//         ...Erc20Fields
//       }
//       value
//     }
//     recipient
//     referralFee
//   }
//   ... on LimitedTimedFeeCollectModuleSettings {
//     type
//     collectLimit
//     amount {
//       asset {
//         ...Erc20Fields
//       }
//       value
//     }
//     recipient
//     referralFee
//     endTimestamp
//   }
//   ... on RevertCollectModuleSettings {
//     type
//   }
//   ... on TimedFeeCollectModuleSettings {
//     type
//     amount {
//       asset {
//         ...Erc20Fields
//       }
//       value
//     }
//     recipient
//     referralFee
//     endTimestamp
//   }
//   ... on UnknownCollectModuleSettings {
//     type
//     contractAddress
//     collectModuleReturnData
//   }
// }

// fragment ReferenceModuleFields on ReferenceModule {
//   ... on FollowOnlyReferenceModuleSettings {
//     type
//     contractAddress
//   }
//   ... on UnknownReferenceModuleSettings {
//     type
//     contractAddress
//     referenceModuleReturnData
//   }
//   ... on DegreesOfSeparationReferenceModuleSettings {
//     type
//     contractAddress
//     commentsRestricted
//     mirrorsRestricted
//     degreesOfSeparation
//   }
// }

// `

export const explorePublications = `
  query {
    explorePublications(request: {
      sortCriteria: TOP_COMMENTED,
      publicationTypes: [POST],
      limit: 1
    }) {
      items {
        __typename 
        ... on Post {
          ...PostFields
        }
      }
    }
  }

  fragment ProfileFields on Profile {
    id
    name
    bio
    attributes {
      displayType
      traitType
      key
      value
    }
    metadata
    isDefault
    handle
    picture {
      ... on NftImage {
        contractAddress
        tokenId
        uri
        verified
      }
      ... on MediaSet {
        original {
          ...MediaFields
        }
        small {
          ...MediaFields
        }
        medium {
          ...MediaFields
        }
      }
    }
    coverPicture {
      ... on NftImage {
        contractAddress
        tokenId
        uri
        verified
      }
      ... on MediaSet {
        original {
          ...MediaFields
        }
        small {
         ...MediaFields
        }
        medium {
          ...MediaFields
        }
      }
    }
    ownedBy
    dispatcher {
      address
    }
    stats {
      totalFollowers
      totalFollowing
      totalPosts
      totalComments
      totalMirrors
      totalPublications
      totalCollects
    }
    followModule {
      ... on FeeFollowModuleSettings {
        type
        amount {
          asset {
            name
            symbol
            decimals
            address
          }
          value
        }
        recipient
      }
      ... on ProfileFollowModuleSettings {
       type
      }
      ... on RevertFollowModuleSettings {
       type
      }
    }
  }

  fragment MediaFields on Media {
    url
    width
    height
    mimeType
  }

  fragment PublicationStatsFields on PublicationStats { 
    totalAmountOfMirrors
    totalAmountOfCollects
    totalAmountOfComments
  }

  fragment MetadataOutputFields on MetadataOutput {
    name
    description
    content
    media {
      original {
        ...MediaFields
      }
      small {
        ...MediaFields
      }
      medium {
        ...MediaFields
      }
    }
    attributes {
      displayType
      traitType
      value
    }
  }

  fragment PostFields on Post {
    id
    profile {
      ...ProfileFields
    }
    stats {
      ...PublicationStatsFields
    }
    metadata {
      ...MetadataOutputFields
    }
    createdAt
    appId
  }
`
export const explorePublicationsForAProfile = `
query Publications($id: ProfileId!) {
  publications(request: {
    "profileId": $id,
    "publicationTypes": ["POST", "COMMENT", "MIRROR"]
    limit: 20,
    metadata: {
        mainContentFocus: [IMAGE, VIDEO]
    }
  }) {
    items {
      __typename 
      ... on Post {
        ...PostFields
      }
      ... on Comment {
        ...CommentFields
      }
      ... on Mirror {
        ...MirrorFields
      }
    }
    pageInfo {
      prev
      next
      totalCount
    }
  }
}

fragment MediaFields on Media {
  url
  mimeType
}

fragment ProfileFields on Profile {
  id
  name
  bio
  attributes {
     displayType
     traitType
     key
     value
  }
  isFollowedByMe
  isFollowing(who: null)
  followNftAddress
  metadata
  isDefault
  handle
  picture {
    ... on NftImage {
      contractAddress
      tokenId
      uri
      verified
    }
    ... on MediaSet {
      original {
        ...MediaFields
      }
    }
  }
  coverPicture {
    ... on NftImage {
      contractAddress
      tokenId
      uri
      verified
    }
    ... on MediaSet {
      original {
        ...MediaFields
      }
    }
  }
  ownedBy
  dispatcher {
    address
  }
  stats {
    totalFollowers
    totalFollowing
    totalPosts
    totalComments
    totalMirrors
    totalPublications
    totalCollects
  }
  followModule {
    ...FollowModuleFields
  }
}

fragment PublicationStatsFields on PublicationStats { 
  totalAmountOfMirrors
  totalAmountOfCollects
  totalAmountOfComments
  totalUpvotes
  totalDownvotes
}

fragment MetadataOutputFields on MetadataOutput {
  name
  description
  content
  media {
    original {
      ...MediaFields
    }
  }
  attributes {
    displayType
    traitType
    value
  }
}

fragment Erc20Fields on Erc20 {
  name
  symbol
  decimals
  address
}

fragment PostFields on Post {
  id
  profile {
    ...ProfileFields
  }
  stats {
    ...PublicationStatsFields
  }
  metadata {
    ...MetadataOutputFields
  }
  createdAt
  collectModule {
    ...CollectModuleFields
  }
  referenceModule {
    ...ReferenceModuleFields
  }
  appId
  hidden
  reaction(request: null)
  mirrors(by: null)
  hasCollectedByMe
}

fragment MirrorBaseFields on Mirror {
  id
  profile {
    ...ProfileFields
  }
  stats {
    ...PublicationStatsFields
  }
  metadata {
    ...MetadataOutputFields
  }
  createdAt
  collectModule {
    ...CollectModuleFields
  }
  referenceModule {
    ...ReferenceModuleFields
  }
  appId
  hidden
  reaction(request: null)
  hasCollectedByMe
}

fragment MirrorFields on Mirror {
  ...MirrorBaseFields
  mirrorOf {
   ... on Post {
      ...PostFields          
   }
   ... on Comment {
      ...CommentFields          
   }
  }
}

fragment CommentBaseFields on Comment {
  id
  profile {
    ...ProfileFields
  }
  stats {
    ...PublicationStatsFields
  }
  metadata {
    ...MetadataOutputFields
  }
  createdAt
  collectModule {
    ...CollectModuleFields
  }
  referenceModule {
    ...ReferenceModuleFields
  }
  appId
  hidden
  reaction(request: null)
  mirrors(by: null)
  hasCollectedByMe
}

fragment CommentFields on Comment {
  ...CommentBaseFields
  mainPost {
    ... on Post {
      ...PostFields
    }
    ... on Mirror {
      ...MirrorBaseFields
      mirrorOf {
        ... on Post {
           ...PostFields          
        }
        ... on Comment {
           ...CommentMirrorOfFields        
        }
      }
    }
  }
}

fragment CommentMirrorOfFields on Comment {
  ...CommentBaseFields
  mainPost {
    ... on Post {
      ...PostFields
    }
    ... on Mirror {
       ...MirrorBaseFields
    }
  }
}

fragment FollowModuleFields on FollowModule {
  ... on FeeFollowModuleSettings {
    type
    amount {
      asset {
        name
        symbol
        decimals
        address
      }
      value
    }
    recipient
  }
  ... on ProfileFollowModuleSettings {
    type
    contractAddress
  }
  ... on RevertFollowModuleSettings {
    type
    contractAddress
  }
  ... on UnknownFollowModuleSettings {
    type
    contractAddress
    followModuleReturnData
  }
}

fragment CollectModuleFields on CollectModule {
  __typename
  ... on FreeCollectModuleSettings {
    type
    followerOnly
    contractAddress
  }
  ... on FeeCollectModuleSettings {
    type
    amount {
      asset {
        ...Erc20Fields
      }
      value
    }
    recipient
    referralFee
  }
  ... on LimitedFeeCollectModuleSettings {
    type
    collectLimit
    amount {
      asset {
        ...Erc20Fields
      }
      value
    }
    recipient
    referralFee
  }
  ... on LimitedTimedFeeCollectModuleSettings {
    type
    collectLimit
    amount {
      asset {
        ...Erc20Fields
      }
      value
    }
    recipient
    referralFee
    endTimestamp
  }
  ... on RevertCollectModuleSettings {
    type
  }
  ... on TimedFeeCollectModuleSettings {
    type
    amount {
      asset {
        ...Erc20Fields
      }
      value
    }
    recipient
    referralFee
    endTimestamp
  }
  ... on UnknownCollectModuleSettings {
    type
    contractAddress
    collectModuleReturnData
  }
}

fragment ReferenceModuleFields on ReferenceModule {
  ... on FollowOnlyReferenceModuleSettings {
    type
    contractAddress
  }
  ... on UnknownReferenceModuleSettings {
    type
    contractAddress
    referenceModuleReturnData
  }
  ... on DegreesOfSeparationReferenceModuleSettings {
    type
    contractAddress
    commentsRestricted
    mirrorsRestricted
    degreesOfSeparation
  }
}

`

export const getCommentsOfAPublication = `
query Publications  ($id: PublicationId!) {
  publications(request: {
    publicationTypes: [COMMENT],
    "commentsOf": $id,
    limit: 10
  }) {
    items {
      __typename 
      ... on Post {
        ...PostFields
      }
      ... on Comment {
        ...CommentFields
      }
      ... on Mirror {
        ...MirrorFields
      }
    }
    pageInfo {
      prev
      next
      totalCount
    }
  }
}

fragment MediaFields on Media {
  url
  mimeType
}

fragment ProfileFields on Profile {
  id
  name
  bio
  attributes {
     displayType
     traitType
     key
     value
  }
  isFollowedByMe
  isFollowing(who: null)
  followNftAddress
  metadata
  isDefault
  handle
  picture {
    ... on NftImage {
      contractAddress
      tokenId
      uri
      verified
    }
    ... on MediaSet {
      original {
        ...MediaFields
      }
    }
  }
  coverPicture {
    ... on NftImage {
      contractAddress
      tokenId
      uri
      verified
    }
    ... on MediaSet {
      original {
        ...MediaFields
      }
    }
  }
  ownedBy
  dispatcher {
    address
  }
  stats {
    totalFollowers
    totalFollowing
    totalPosts
    totalComments
    totalMirrors
    totalPublications
    totalCollects
  }
  followModule {
    ...FollowModuleFields
  }
}

fragment PublicationStatsFields on PublicationStats { 
  totalAmountOfMirrors
  totalAmountOfCollects
  totalAmountOfComments
  totalUpvotes
  totalDownvotes
}

fragment MetadataOutputFields on MetadataOutput {
  name
  description
  content
  media {
    original {
      ...MediaFields
    }
  }
  attributes {
    displayType
    traitType
    value
  }
}

fragment Erc20Fields on Erc20 {
  name
  symbol
  decimals
  address
}

fragment PostFields on Post {
  id
  profile {
    ...ProfileFields
  }
  stats {
    ...PublicationStatsFields
  }
  metadata {
    ...MetadataOutputFields
  }
  createdAt
  collectModule {
    ...CollectModuleFields
  }
  referenceModule {
    ...ReferenceModuleFields
  }
  appId
  hidden
  reaction(request: null)
  mirrors(by: null)
  hasCollectedByMe
}

fragment MirrorBaseFields on Mirror {
  id
  profile {
    ...ProfileFields
  }
  stats {
    ...PublicationStatsFields
  }
  metadata {
    ...MetadataOutputFields
  }
  createdAt
  collectModule {
    ...CollectModuleFields
  }
  referenceModule {
    ...ReferenceModuleFields
  }
  appId
  hidden
  reaction(request: null)
  hasCollectedByMe
}

fragment MirrorFields on Mirror {
  ...MirrorBaseFields
  mirrorOf {
   ... on Post {
      ...PostFields          
   }
   ... on Comment {
      ...CommentFields          
   }
  }
}

fragment CommentBaseFields on Comment {
  id
  profile {
    ...ProfileFields
  }
  stats {
    ...PublicationStatsFields
  }
  metadata {
    ...MetadataOutputFields
  }
  createdAt
  collectModule {
    ...CollectModuleFields
  }
  referenceModule {
    ...ReferenceModuleFields
  }
  appId
  hidden
  reaction(request: null)
  mirrors(by: null)
  hasCollectedByMe
}

fragment CommentFields on Comment {
  ...CommentBaseFields
  mainPost {
    ... on Post {
      ...PostFields
    }
    ... on Mirror {
      ...MirrorBaseFields
      mirrorOf {
        ... on Post {
           ...PostFields          
        }
        ... on Comment {
           ...CommentMirrorOfFields        
        }
      }
    }
  }
}

fragment CommentMirrorOfFields on Comment {
  ...CommentBaseFields
  mainPost {
    ... on Post {
      ...PostFields
    }
    ... on Mirror {
       ...MirrorBaseFields
    }
  }
}

fragment FollowModuleFields on FollowModule {
  ... on FeeFollowModuleSettings {
    type
    amount {
      asset {
        name
        symbol
        decimals
        address
      }
      value
    }
    recipient
  }
  ... on ProfileFollowModuleSettings {
    type
    contractAddress
  }
  ... on RevertFollowModuleSettings {
    type
    contractAddress
  }
  ... on UnknownFollowModuleSettings {
    type
    contractAddress
    followModuleReturnData
  }
}

fragment CollectModuleFields on CollectModule {
  __typename
  ... on FreeCollectModuleSettings {
    type
    followerOnly
    contractAddress
  }
  ... on FeeCollectModuleSettings {
    type
    amount {
      asset {
        ...Erc20Fields
      }
      value
    }
    recipient
    referralFee
  }
  ... on LimitedFeeCollectModuleSettings {
    type
    collectLimit
    amount {
      asset {
        ...Erc20Fields
      }
      value
    }
    recipient
    referralFee
  }
  ... on LimitedTimedFeeCollectModuleSettings {
    type
    collectLimit
    amount {
      asset {
        ...Erc20Fields
      }
      value
    }
    recipient
    referralFee
    endTimestamp
  }
  ... on RevertCollectModuleSettings {
    type
  }
  ... on TimedFeeCollectModuleSettings {
    type
    amount {
      asset {
        ...Erc20Fields
      }
      value
    }
    recipient
    referralFee
    endTimestamp
  }
  ... on UnknownCollectModuleSettings {
    type
    contractAddress
    collectModuleReturnData
  }
}

fragment ReferenceModuleFields on ReferenceModule {
  ... on FollowOnlyReferenceModuleSettings {
    type
    contractAddress
  }
  ... on UnknownReferenceModuleSettings {
    type
    contractAddress
    referenceModuleReturnData
  }
  ... on DegreesOfSeparationReferenceModuleSettings {
    type
    contractAddress
    commentsRestricted
    mirrorsRestricted
    degreesOfSeparation
  }
}

`
export const getPublicationById = `
query Publication($id: InternalPublicationId!) {
  publication(request: {
    publicationId: $id
  }) {
   __typename 
    ... on Post {
      ...PostFields
    }
    ... on Comment {
      ...CommentFields
    }
    ... on Mirror {
      ...MirrorFields
    }
  }
}

fragment MediaFields on Media {
  url
  mimeType
}

fragment ProfileFields on Profile {
  id
  name
  bio
  attributes {
    displayType
    traitType
    key
    value
  }
  isFollowedByMe
  isFollowing(who: null)
  followNftAddress
  metadata
  isDefault
  handle
  picture {
    ... on NftImage {
      contractAddress
      tokenId
      uri
      verified
    }
    ... on MediaSet {
      original {
        ...MediaFields
      }
    }
  }
  coverPicture {
    ... on NftImage {
      contractAddress
      tokenId
      uri
      verified
    }
    ... on MediaSet {
      original {
        ...MediaFields
      }
    }
  }
  ownedBy
  dispatcher {
    address
  }
  stats {
    totalFollowers
    totalFollowing
    totalPosts
    totalComments
    totalMirrors
    totalPublications
    totalCollects
  }
  followModule {
    ...FollowModuleFields
  }
}

fragment PublicationStatsFields on PublicationStats { 
  totalAmountOfMirrors
  totalAmountOfCollects
  totalAmountOfComments
}

fragment MetadataOutputFields on MetadataOutput {
  name
  description
  content
  media {
    original {
      ...MediaFields
    }
  }
  attributes {
    displayType
    traitType
    value
  }
}

fragment Erc20Fields on Erc20 {
  name
  symbol
  decimals
  address
}

fragment PostFields on Post {
  id
  profile {
    ...ProfileFields
  }
  stats {
    ...PublicationStatsFields
  }
  metadata {
    ...MetadataOutputFields
  }
  createdAt
  collectModule {
    ...CollectModuleFields
  }
  referenceModule {
    ...ReferenceModuleFields
  }
  appId
  hidden
  reaction(request: null)
  mirrors(by: null)
  hasCollectedByMe
}

fragment MirrorBaseFields on Mirror {
  id
  profile {
    ...ProfileFields
  }
  stats {
    ...PublicationStatsFields
  }
  metadata {
    ...MetadataOutputFields
  }
  createdAt
  collectModule {
    ...CollectModuleFields
  }
  referenceModule {
    ...ReferenceModuleFields
  }
  appId
  hidden
  reaction(request: null)
  hasCollectedByMe
}

fragment MirrorFields on Mirror {
  ...MirrorBaseFields
  mirrorOf {
   ... on Post {
      ...PostFields          
   }
   ... on Comment {
      ...CommentFields          
   }
  }
}

fragment CommentBaseFields on Comment {
  id
  profile {
    ...ProfileFields
  }
  stats {
    ...PublicationStatsFields
  }
  metadata {
    ...MetadataOutputFields
  }
  createdAt
  collectModule {
    ...CollectModuleFields
  }
  referenceModule {
    ...ReferenceModuleFields
  }
  appId
  hidden
  reaction(request: null)
  mirrors(by: null)
  hasCollectedByMe
}

fragment CommentFields on Comment {
  ...CommentBaseFields
  mainPost {
    ... on Post {
      ...PostFields
    }
    ... on Mirror {
      ...MirrorBaseFields
      mirrorOf {
        ... on Post {
           ...PostFields          
        }
        ... on Comment {
           ...CommentMirrorOfFields        
        }
      }
    }
  }
}

fragment CommentMirrorOfFields on Comment {
  ...CommentBaseFields
  mainPost {
    ... on Post {
      ...PostFields
    }
    ... on Mirror {
       ...MirrorBaseFields
    }
  }
}

fragment FollowModuleFields on FollowModule {
  ... on FeeFollowModuleSettings {
    type
    amount {
      asset {
        name
        symbol
        decimals
        address
      }
      value
    }
    recipient
  }
  ... on ProfileFollowModuleSettings {
    type
    contractAddress
  }
  ... on RevertFollowModuleSettings {
    type
    contractAddress
  }
  ... on UnknownFollowModuleSettings {
    type
    contractAddress
    followModuleReturnData
  }
}

fragment CollectModuleFields on CollectModule {
  __typename
  ... on FreeCollectModuleSettings {
    type
    followerOnly
    contractAddress
  }
  ... on FeeCollectModuleSettings {
    type
    amount {
      asset {
        ...Erc20Fields
      }
      value
    }
    recipient
    referralFee
  }
  ... on LimitedFeeCollectModuleSettings {
    type
    collectLimit
    amount {
      asset {
        ...Erc20Fields
      }
      value
    }
    recipient
    referralFee
  }
  ... on LimitedTimedFeeCollectModuleSettings {
    type
    collectLimit
    amount {
      asset {
        ...Erc20Fields
      }
      value
    }
    recipient
    referralFee
    endTimestamp
  }
  ... on RevertCollectModuleSettings {
    type
  }
  ... on TimedFeeCollectModuleSettings {
    type
    amount {
      asset {
        ...Erc20Fields
      }
      value
    }
    recipient
    referralFee
    endTimestamp
  }
  ... on UnknownCollectModuleSettings {
    type
    contractAddress
    collectModuleReturnData
  }
}

fragment ReferenceModuleFields on ReferenceModule {
  ... on FollowOnlyReferenceModuleSettings {
    type
    contractAddress
  }
  ... on UnknownReferenceModuleSettings {
    type
    contractAddress
    referenceModuleReturnData
  }
  ... on DegreesOfSeparationReferenceModuleSettings {
    type
    contractAddress
    commentsRestricted
    mirrorsRestricted
    degreesOfSeparation
  }
}

`

export const getChallenge = `
query Challenge($address: EthereumAddress!) {
  challenge(request: { address: $address }) {
    text
  }
}
`

export const Authentication = `
mutation Authenticate($address: EthereumAddress!, $signature: Signature!) {
  authenticate(request: {
    address: $address,
    signature: $signature
  }) {
    accessToken
    refreshToken
  }
}
`

export const CreateProfileLens = `
mutation CreateProfile($handle: CreateHandle!) {
  createProfile(request:{ 
                  handle: $handle,
                  profilePictureUri: null,
                  followNFTURI: null,
                  followModule: null
                }) {
    ... on RelayerResult {
      txHash
    }
    ... on RelayError {
      reason
    }
    __typename
  }
}
`

export const HasTxHashBeenIndexed  = `
query HasTxHashBeenIndexed($txHash: TxHash!) {
  hasTxHashBeenIndexed(request: { txHash: $txHash }) {
    ... on TransactionIndexedResult {
      indexed
      txReceipt {
        to
        from
        contractAddress
        transactionIndex
        root
        gasUsed
        logsBloom
        blockHash
        transactionHash
        blockNumber
        confirmations
        cumulativeGasUsed
        effectiveGasPrice
        byzantium
        type
        status
        logs {
          blockNumber
          blockHash
          transactionIndex
          removed
          address
          data
          topics
          transactionHash
          logIndex
        }
      }
      metadataStatus {
        status
        reason
      }
    }
    ... on TransactionError {
      reason
      txReceipt {
        to
        from
        contractAddress
        transactionIndex
        root
        gasUsed
        logsBloom
        blockHash
        transactionHash
        blockNumber
        confirmations
        cumulativeGasUsed
        effectiveGasPrice
        byzantium
        type
        status
        logs {
          blockNumber
          blockHash
          transactionIndex
          removed
          address
          data
          topics
          transactionHash
          logIndex
        }
      }
    },
    __typename
  }
}
`

export const GetDefaultProfile = `
query DefaultProfile($address: EthereumAddress!) {
  defaultProfile(request: { ethereumAddress: $address}) {
    id
    name
    bio
    isDefault
    attributes {
      displayType
      traitType
      key
      value
    }
    followNftAddress
    metadata
    handle
    picture {
      ... on NftImage {
        contractAddress
        tokenId
        uri
        chainId
        verified
      }
      ... on MediaSet {
        original {
          url
          mimeType
        }
      }
    }
    coverPicture {
      ... on NftImage {
        contractAddress
        tokenId
        uri
        chainId
        verified
      }
      ... on MediaSet {
        original {
          url
          mimeType
        }
      }
    }
    ownedBy
    dispatcher {
      address
      canUseRelay
    }
    stats {
      totalFollowers
      totalFollowing
      totalPosts
      totalComments
      totalMirrors
      totalPublications
      totalCollects
    }
    followModule {
      ... on FeeFollowModuleSettings {
        type
        contractAddress
        amount {
          asset {
            name
            symbol
            decimals
            address
          }
          value
        }
        recipient
      }
      ... on ProfileFollowModuleSettings {
       type
      }
      ... on RevertFollowModuleSettings {
       type
      }
    }
  }
}
`

export const CreatePost = ``