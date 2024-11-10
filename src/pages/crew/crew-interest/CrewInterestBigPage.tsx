import { useState } from 'react';

import classNames from 'classnames/bind';
import { Link, useNavigate, useLocation } from 'react-router-dom';

import { useCrewListQuery } from '@/apis/react-query/crew/useCrewQuery';
import { useInterestSmallQuery } from '@/apis/react-query/interest/useInterestQuery';
import CrewAddIcon from '@/assets/icons/CrewAddIcon.svg?react';
import CrewCard from '@/components/common/crew-card/CrewCard';
import CommonHeader from '@/components/header/CommonHeader';

import styles from './CrewInterestBigPage.module.scss';

const CrewInterestBigPage = () => {
  const cn = classNames.bind(styles);
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const interestBigId = queryParams.get('interestBigId');
  const interestSmallId = queryParams.get('interestSmallId');
  const name = queryParams.get('name');

  const [interestBigName] = useState<string>(name || '전체');

  const { data: interestData } = useCrewListQuery({
    interestBigId: Number(interestBigId),
    ...(interestSmallId !== null && {
      interestSmallId: Number(interestSmallId),
    }),
    page: 1,
  });

  const { data: interestSmallData } = useInterestSmallQuery(
    Number(interestBigId) || 0,
  );

  const handleInterestBigClick = (interestBigId: number, name: string) => {
    navigate(`/crew?interestBigId=${interestBigId}&name=${name}`);
  };

  const handleInterestSmallClick = (interestSmallId: number, name: string) => {
    navigate(
      `/crew?interestBigId=${interestBigId}&interestSmallId=${interestSmallId}&name=${name}`,
    );
  };

  const handleClickBack = () => {
    navigate('/');
  };

  return (
    <div className={cn('container')}>
      <div className={cn('header')}>
        {name && <CommonHeader title={name} onBackClick={handleClickBack} />}
      </div>

      {/* 상세 관심사 선택 */}
      <div className={styles.interest_list}>
        <div
          className={styles.interest_item}
          onClick={() =>
            handleInterestBigClick(Number(interestBigId), interestBigName)
          }
        >
          <span className={cn('interest_name')}>{interestBigName}</span>
        </div>
        {interestSmallData?.map((interest) => (
          <div
            key={interest.interestSmallId}
            className={styles.interest_item}
            onClick={() =>
              interest.interestSmallId !== null &&
              handleInterestSmallClick(interest.interestSmallId, interest.name)
            }
          >
            <span className={cn('interest_name')}>{interest.name}</span>
          </div>
        ))}
      </div>

      {/* 관심사 별 모임 */}
      <div className={cn('crew_list')}>
        {interestData && interestData.length > 0 ? (
          interestData.map((crew) => (
            <div key={crew.crewId}>
              <CrewCard crew={crew} />
            </div>
          ))
        ) : (
          <span>결과가 없습니다.</span>
        )}
      </div>

      {/* 모임 등록 버튼 */}
      <Link
        className={styles.button_container}
        to="/crew/register/interest-big"
      >
        <CrewAddIcon />
      </Link>
    </div>
  );
};

export default CrewInterestBigPage;
