import { firestore } from '@/firebase/clientApp';
import { ICommunity } from '@/store/useCommunityStore';
import { doc, getDoc } from 'firebase/firestore';
import { GetServerSidePropsContext } from 'next';
import safeJsonStringify from 'safe-json-stringify';

interface CommunityPageProps {
  communityData: ICommunity;
}

const CommunityPage: React.FC<CommunityPageProps> = ({ communityData }) => {
  console.log('data', communityData);
  return <div>Welcome to {communityData.id}</div>;
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  // Get the community data and pass it to the component
  try {
    const communityDocRef = doc(firestore, 'communities', context.query.communityId as string);
    const communityDoc = await getDoc(communityDocRef);

    return {
      props: {
        communityData: JSON.parse(
          safeJsonStringify({ id: communityDoc.id, ...communityDoc.data() })
        ),
      },
    };
  } catch (err) {
    // Could add error page here
    console.error('getServerSideProps error', err);
  }
}

export default CommunityPage;
