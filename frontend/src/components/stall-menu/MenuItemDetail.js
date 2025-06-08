import React from 'react';
import { useApp } from '../../context/AppContext';
import { useTranslation } from '../../hooks/useTranslation';

function MenuItemDetail({ item, onClose }) {
  const { dispatch } = useApp();
  const { currentLanguage, t } = useTranslation();

  // Get the item name and description in the current language
  const itemName = currentLanguage === 'BM' && item.name_bm ? item.name_bm : item.name;
  const itemDescription = currentLanguage === 'BM' && item.description_bm ? item.description_bm : item.description;
  const itemAllergens = currentLanguage === 'BM' && item.allergens_bm ? item.allergens_bm : item.allergens;

  const handleAddToCart = () => {
    dispatch({ type: 'ADD_TO_CART', payload: item });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
      <div className="bg-white rounded-t-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            {currentLanguage === 'BM' ? 'Butiran Menu' : 'Menu Item Details'}
          </h2>
          <button onClick={onClose} className="p-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-4">
          {/* Item Image */}
          <div className="w-full h-48 bg-gradient-to-br from-yellow-200 to-orange-200 rounded-lg flex items-center justify-center mb-4">
            <span className="text-6xl">🍽️</span>
          </div>

          {/* Badges */}
          <div className="mb-3 space-x-2">
            {item.is_best_seller && (
              <span className="inline-block bg-orange-500 text-white text-xs px-3 py-1 rounded-full">
                {currentLanguage === 'BM' ? 'Paling Laku' : 'Best Seller'}
              </span>
            )}
            {item.is_hospital_friendly && (
              <span className="inline-block bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full">
                {currentLanguage === 'BM' ? 'Mesra Hospital' : 'Hospital-Friendly'}
              </span>
            )}
          </div>

          {/* Item Info */}
          <h1 className="text-2xl font-bold text-gray-800 mb-2">{itemName}</h1>
          <p className="text-primary-600 font-bold text-xl mb-4">
            RM {item.price.toFixed(2)} / {currentLanguage === 'BM' ? 'hidangan' : 'serving'}
          </p>

          {/* Description */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-800 mb-2">
              {currentLanguage === 'BM' ? 'Penerangan' : 'Description'}
            </h3>
            <p className="text-gray-600 leading-relaxed">{itemDescription}</p>
          </div>

          {/* Nutritional Information */}
          {(item.calories || item.protein || item.carbs || item.fat) && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-800 mb-3">
                {currentLanguage === 'BM' ? 'Maklumat Nutrisi' : 'Nutritional Information'}
              </h3>
              <div className="grid grid-cols-4 gap-4 mb-4">
                <div className="text-center">
                  <div className="font-bold text-lg">{item.calories || 'N/A'}</div>
                  <div className="text-xs text-gray-500">
                    {currentLanguage === 'BM' ? 'Kalori' : 'Calories'}
                  </div>
                  <div className="text-xs text-gray-500">kcal</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-lg">{item.protein || 'N/A'}</div>
                  <div className="text-xs text-gray-500">
                    {currentLanguage === 'BM' ? 'Protein' : 'Protein'}
                  </div>
                  <div className="text-xs text-gray-500">g</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-lg">{item.carbs || 'N/A'}</div>
                  <div className="text-xs text-gray-500">
                    {currentLanguage === 'BM' ? 'Karbohidrat' : 'Carbs'}
                  </div>
                  <div className="text-xs text-gray-500">g</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-lg">{item.fat || 'N/A'}</div>
                  <div className="text-xs text-gray-500">
                    {currentLanguage === 'BM' ? 'Lemak' : 'Fat'}
                  </div>
                  <div className="text-xs text-gray-500">g</div>
                </div>
              </div>

              {/* Allergy Information */}
              {itemAllergens && itemAllergens.length > 0 && (
                <p className="text-sm text-orange-600 mb-2">
                  {currentLanguage === 'BM' ? 'Maklumat Alergi: Mengandungi ' : 'Allergy Information: Contains '}
                  {itemAllergens.join(', ')}
                </p>
              )}
            </div>
          )}

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className="btn-primary w-full text-lg py-4"
            disabled={!item.is_available}
          >
            {item.is_available 
              ? (currentLanguage === 'BM' ? 'TAMBAH KE TROLI' : 'ADD TO CART')
              : (currentLanguage === 'BM' ? 'TIDAK TERSEDIA' : 'UNAVAILABLE')
            }
          </button>
        </div>
      </div>
    </div>
  );
}

export default MenuItemDetail; 