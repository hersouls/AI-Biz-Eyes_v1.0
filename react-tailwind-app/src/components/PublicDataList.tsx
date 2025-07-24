import React, { useState, useEffect, useCallback } from 'react';
import { PublicDataService } from '../services/publicDataService';
import { PublicDataItem, PublicDataFilters } from '../types/publicData';

interface PublicDataListProps {
  title?: string;
  showFilters?: boolean;
  limit?: number;
}

const PublicDataList: React.FC<PublicDataListProps> = ({ 
  title = "공공데이터포털", 
  showFilters = true, 
  limit = 10 
}) => {
  const [data, setData] = useState<PublicDataItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<PublicDataFilters>({});
  const [searchQuery, setSearchQuery] = useState('');

  const loadPublicData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await PublicDataService.getPublicDataList(filters, 1, limit);
      
      if (response.success) {
        setData(response.data.items);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError('데이터를 불러오는 중 오류가 발생했습니다.');
      console.error('Error loading public data:', err);
    } finally {
      setLoading(false);
    }
  }, [filters, limit]);

  useEffect(() => {
    loadPublicData();
  }, [loadPublicData]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadPublicData();
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await PublicDataService.searchPublicData(searchQuery, filters);
      
      if (response.success) {
        setData(response.data.items);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError('검색 중 오류가 발생했습니다.');
      console.error('Error searching public data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (id: number) => {
    try {
      const response = await PublicDataService.downloadPublicData(id);
      
      if (response.success) {
        // 실제 다운로드 링크 생성
        const link = document.createElement('a');
        link.href = response.data.downloadUrl;
        link.download = response.data.fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        alert('다운로드가 시작됩니다.');
      } else {
        alert('다운로드에 실패했습니다.');
      }
    } catch (err) {
      alert('다운로드 중 오류가 발생했습니다.');
      console.error('Error downloading public data:', err);
    }
  };

  const formatFileSize = (size: string) => {
    return size;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR');
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'IT/소프트웨어': 'bg-blue-100 text-blue-800',
      '도시/교통': 'bg-green-100 text-green-800',
      '경제/금융': 'bg-yellow-100 text-yellow-800',
      '과학기술': 'bg-purple-100 text-purple-800',
      '환경/에너지': 'bg-emerald-100 text-emerald-800',
      '교육/문화': 'bg-pink-100 text-pink-800',
      '의료/복지': 'bg-red-100 text-red-800',
      '기타': 'bg-gray-100 text-gray-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const getDataTypeIcon = (dataType: string) => {
    const icons: Record<string, string> = {
      'JSON': '📄',
      'CSV': '📊',
      'XML': '📋',
      'XLSX': '📈'
    };
    return icons[dataType] || '📄';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">데이터를 불러오는 중...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center text-red-600">
          <p className="text-lg font-semibold">오류 발생</p>
          <p className="text-sm mt-2">{error}</p>
          <button 
            onClick={loadPublicData}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">총 {data.length}건</span>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      {showFilters && (
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="데이터 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={handleSearch}
                  className="absolute right-2 top-2 text-gray-400 hover:text-gray-600"
                >
                  🔍
                </button>
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={filters.category || ''}
                onChange={(e) => setFilters({ ...filters, category: e.target.value || undefined })}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">전체 카테고리</option>
                <option value="IT/소프트웨어">IT/소프트웨어</option>
                <option value="도시/교통">도시/교통</option>
                <option value="경제/금융">경제/금융</option>
                <option value="과학기술">과학기술</option>
                <option value="환경/에너지">환경/에너지</option>
                <option value="교육/문화">교육/문화</option>
                <option value="의료/복지">의료/복지</option>
                <option value="기타">기타</option>
              </select>
              <select
                value={filters.dataType || ''}
                onChange={(e) => setFilters({ ...filters, dataType: e.target.value || undefined })}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">전체 형식</option>
                <option value="JSON">JSON</option>
                <option value="CSV">CSV</option>
                <option value="XML">XML</option>
                <option value="XLSX">XLSX</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Data List */}
      <div className="divide-y divide-gray-200">
        {data.length === 0 ? (
          <div className="px-6 py-8 text-center text-gray-500">
            <p>검색 결과가 없습니다.</p>
          </div>
        ) : (
          data.map((item) => (
            <div key={item.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{getDataTypeIcon(item.dataType)}</span>
                    <h3 className="text-lg font-medium text-gray-900 hover:text-blue-600 cursor-pointer">
                      {item.title}
                    </h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(item.category)}`}>
                      {item.category}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {item.description}
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                    <span>📊 {item.organization}</span>
                    <span>📅 {formatDate(item.publishDate)}</span>
                    <span>📁 {formatFileSize(item.fileSize)}</span>
                    <span>👁️ {item.viewCount.toLocaleString()}회</span>
                    <span>⬇️ {item.downloadCount.toLocaleString()}회</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mt-2">
                    {item.tags.slice(0, 3).map((tag, index) => (
                      <span 
                        key={index}
                        className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded"
                      >
                        #{tag}
                      </span>
                    ))}
                    {item.tags.length > 3 && (
                      <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                        +{item.tags.length - 3}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="ml-4 flex flex-col items-end gap-2">
                  <button
                    onClick={() => handleDownload(item.id)}
                    className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    다운로드
                  </button>
                  <div className="text-xs text-gray-400">
                    {item.isFree ? '무료' : '유료'}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>공공데이터포털에서 제공하는 데이터입니다.</span>
          <button
            onClick={loadPublicData}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            새로고침
          </button>
        </div>
      </div>
    </div>
  );
};

export default PublicDataList;