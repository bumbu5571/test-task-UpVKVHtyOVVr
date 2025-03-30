'use client';

import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import styles from './pagination.module.scss';

export default function Pagination({ totalPages }: { totalPages: number }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;

  const allPages = generatePagination(currentPage, totalPages);

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };
  return (
    <>
      <div className={styles.paginationContainer}>
        <PaginationArrow
          direction='left'
          href={createPageURL(currentPage - 1)}
          isDisabled={currentPage <= 1}
        />

        <div className={styles.numberContainer}>
          {allPages.map((page, index) => {
            let position: 'first' | 'last' | 'single' | 'middle' | undefined;

            if (index === 0) position = 'first';
            if (index === allPages.length - 1) position = 'last';
            if (allPages.length === 1) position = 'single';
            if (page === '...') position = 'middle';

            return (
              <PaginationNumber
                key={index}
                href={createPageURL(page)}
                page={page}
                position={position}
                isActive={currentPage === page}
              />
            );
          })}
        </div>

        <PaginationArrow
          direction='right'
          href={createPageURL(currentPage + 1)}
          isDisabled={currentPage >= totalPages}
        />
      </div>
    </>
  );
}

function PaginationNumber({
  page,
  href,
  isActive,
  position,
}: {
  page: number | string;
  href: string;
  position?: 'first' | 'last' | 'single' | 'middle'; // *** Вот здесь нужно было исправить ***
  isActive: boolean;
}) {
  let numberClassName = styles.number;

  if (position === 'first') {
    numberClassName += ` ${styles.first}`;
  } else if (position === 'last') {
    numberClassName += ` ${styles.last}`;
  } else if (position === 'single') {
    numberClassName += ` ${styles.first} ${styles.last}`; // first и last вместе
  }

  if (isActive) {
    numberClassName += ` ${styles.active}`;
  }

  if (page === '...') {
    numberClassName += ` ${styles.middle}`;
  }

  return isActive || page === '...' ? (
    <div className={numberClassName}>{page}</div>
  ) : (
    <Link href={href} className={numberClassName}>
      {page}
    </Link>
  );
}

function PaginationArrow({
  href,
  direction,
  isDisabled,
}: {
  href: string;
  direction: 'left' | 'right';
  isDisabled?: boolean;
}) {
  let arrowClassName = styles.arrow;

  if (isDisabled) {
    arrowClassName += ` ${styles.disabled}`;
  }

  if (direction === 'left') {
    arrowClassName += ` ${styles.left}`;
  } else {
    arrowClassName += ` ${styles.right}`;
  }

  const icon =
    direction === 'left' ? (
      <ArrowLeftIcon className={styles.arrowIcon} />
    ) : (
      <ArrowRightIcon className={styles.arrowIcon} />
    );

  return isDisabled ? (
    <div className={arrowClassName}>{icon}</div>
  ) : (
    <Link className={arrowClassName} href={href}>
      {icon}
    </Link>
  );
}

function generatePagination(
  currentPage: number,
  totalPages: number
): (string | number)[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  if (currentPage <= 3) {
    return [1, 2, 3, '...', totalPages - 1, totalPages];
  }

  if (currentPage >= totalPages - 2) {
    return [1, 2, '...', totalPages - 2, totalPages - 1, totalPages];
  }

  return [
    1,
    '...',
    currentPage - 1,
    currentPage,
    currentPage + 1,
    '...',
    totalPages,
  ];
}
