import About from '@/components/Community/About';
import CommunityHeader from '@/components/Community/CommunityHeader';
import CommunityNotFound from '@/components/Community/CommunityNotFound';
import CreatePostLink from '@/components/Community/CreatePostLink';
import PageContentLayout from '@/components/Layout/PageContentLayout';
import Posts from '@/components/Post/Posts';
import { firestore } from '@/firebase/clientApp';
import { ICommunity, useCommunityActions } from '@/store/useCommunityStore';
import { doc, getDoc } from 'firebase/firestore';
import { GetServerSidePropsContext } from 'next';
import { useEffect } from 'react';
import safeJsonStringify from 'safe-json-stringify';

interface CommunityPageProps {
  communityData: ICommunity | null;
}

const CommunityPage: React.FC<CommunityPageProps> = ({ communityData }) => {
  const { setCurrentCommunity } = useCommunityActions();

  useEffect(() => {
    setCurrentCommunity(communityData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [communityData]);

  if (!communityData) {
    return <CommunityNotFound />;
  }

  return (
    <>
      <CommunityHeader communityData={communityData} />
      <PageContentLayout>
        <>
          <CreatePostLink />
          <Posts communityData={communityData} />
        </>

        <>
          <About communityData={communityData} />
        </>
      </PageContentLayout>
    </>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  // Get the community data and pass it to the component
  try {
    const communityDocRef = doc(firestore, 'communities', context.query.communityId as string);
    const communityDoc = await getDoc(communityDocRef);
    const communityData: ICommunity | null = communityDoc.exists()
      ? JSON.parse(safeJsonStringify({ id: communityDoc.id, ...communityDoc.data() }))
      : null;

    return {
      props: {
        communityData,
      },
    };
  } catch (err) {
    // Could add error page here
    console.error('getServerSideProps error', err);
  }
}

export default CommunityPage;
