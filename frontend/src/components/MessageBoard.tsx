import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface Message {
    id: string;
    name: string;
    location: string;
    message: string;
    timestamp: string;
    status: 'pending' | 'approved' | 'rejected';
}

interface MessageBoardProps {
    messages: Message[];
    onAddMessage?: (message: Omit<Message, 'id' | 'timestamp' | 'status'>) => void;
}

const MessageBoard: React.FC<MessageBoardProps> = ({ messages, onAddMessage }) => {
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        location: '',
        message: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.name.trim() && formData.location.trim() && formData.message.trim()) {
            onAddMessage?.(formData);
            setFormData({ name: '', location: '', message: '' });
            setShowForm(false);
        }
    };

    const approvedMessages = messages.filter(msg => msg.status === 'approved');

    return (
        <div className="bg-white rounded-2xl p-8 shadow-xl">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">报名留言板</h3>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
                >
                    {showForm ? '取消' : '我要报名'}
                </button>
            </div>

            {/* 报名表单 */}
            <AnimatePresence>
                {showForm && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mb-8 p-6 bg-purple-50 rounded-xl border border-purple-200"
                    >
                        <h4 className="text-lg font-semibold text-purple-800 mb-4">填写报名信息</h4>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        姓名 *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        placeholder="请输入您的姓名"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        所在地区 *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        placeholder="例如：浙江省杭州市"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    留言内容 *
                                </label>
                                <textarea
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    rows={4}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    placeholder="请简单介绍一下您为什么想参加胶片漂流计划..."
                                    required
                                />
                            </div>
                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                                >
                                    取消
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
                                >
                                    提交报名
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 留言列表 */}
            <div className="space-y-4">
                {approvedMessages.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        <p>暂无留言，快来成为第一个报名者吧！</p>
                    </div>
                ) : (
                    approvedMessages.map((message) => (
                        <motion.div
                            key={message.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-4 bg-gray-50 rounded-lg border-l-4 border-purple-500"
                        >
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <span className="font-semibold text-gray-900">{message.name}</span>
                                    <span className="text-sm text-gray-500 ml-2">· {message.location}</span>
                                </div>
                                <span className="text-xs text-gray-400">{message.timestamp}</span>
                            </div>
                            <p className="text-gray-700 leading-relaxed">{message.message}</p>
                        </motion.div>
                    ))
                )}
            </div>

            {/* 统计信息 */}
            <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>共 {approvedMessages.length} 条留言</span>
                    <span>期待更多朋友加入我们！</span>
                </div>
            </div>
        </div>
    );
};

export default MessageBoard;

