import React from 'react';
import { usePlatform } from '../feature/posts/usePlatforms';
import { useToggle } from '../feature/settings/useToggle';

export default function Settings() {
    const { platformsValues, isLoading: isLoadingPlatforms } = usePlatform();
    const { toggle, isToggle } = useToggle();

    console.log(platformsValues)
    

    if (isLoadingPlatforms) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    const handleToggle = (platformId) => {
        toggle(platformId);
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Platform Management</h1>
            
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="p-6">
                    <h2 className="text-lg font-semibold mb-4">Connected Platforms</h2>
                    {platformsValues?.length > 0 ? (
                        <div className="space-y-4">
                            {platformsValues.map((platform) => (
                                <div 
                                    key={platform.id}
                                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                                >
                                    <div className="flex items-center space-x-3">
                                        <span className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                                            {platform.name.charAt(0).toUpperCase()}
                                        </span>
                                        <div>
                                            <p className="font-medium">{platform.name}</p>
                                            <p className="text-sm text-gray-500">{platform.type}</p>
                                        </div>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={platform.is_active}
                                            onChange={() => handleToggle(platform.id)}
                                            disabled={isToggle}
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                    </label>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center py-4">
                            No platforms available
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}