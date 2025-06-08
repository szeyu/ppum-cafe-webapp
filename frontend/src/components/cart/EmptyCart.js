import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../../hooks/useTranslation';
import { EmptyState } from '../shared';

function EmptyCart() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <EmptyState
      icon="🛒"
      title={t('cart.empty') || 'Your cart is empty'}
      message={t('cart.emptyMessage') || 'Add some delicious items to get started!'}
      actionText={t('cart.browseStalls') || 'Browse Stalls'}
      onAction={() => navigate('/home')}
    />
  );
}

export default EmptyCart; 