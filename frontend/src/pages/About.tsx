import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Globe, Film, MapPin, ArrowRight } from 'lucide-react';
import MessageBoard from '../components/MessageBoard';
import { sampleMessages } from '../data/messages';
import type { Message } from '../components/MessageBoard';

const About: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>(sampleMessages);
    const features = [
        {
            icon: <Film className="h-8 w-8" />,
            title: '胶片摄影',
            description: '使用传统胶片相机，感受摄影的纯粹与质感，每一张照片都是独一无二的艺术品'
        },
        {
            icon: <MapPin className="h-8 w-8" />,
            title: '地理接力',
            description: '跨越不同地域，记录各地的风土人情，用镜头连接城市与乡村'
        },
        {
            icon: <Users className="h-8 w-8" />,
            title: '团队协作',
            description: '多人接力，共同创作，分享摄影的快乐，传递友谊与创意'
        },
        {
            icon: <Globe className="h-8 w-8" />,
            title: '文化传承',
            description: '记录不同地域的文化特色，传承摄影艺术，分享美好时光'
        }
    ];

    const process = [
        {
            step: '01',
            title: '组建小组',
            description: '4个小组，每组6位摄影师，确定接力路线和主题'
        },
        {
            step: '02',
            description: '第一棒摄影师在起点城市拍摄，记录当地特色，添加个人留言'
        },
        {
            step: '03',
            description: '将接力棒（包含照片和留言）传递给下一位摄影师'
        },
        {
            step: '04',
            description: '重复接力过程，直到最后一棒到达终点城市'
        },
        {
            step: '05',
            description: '整理所有照片和留言，形成完整的接力记录'
        }
    ];



    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* 页面标题 */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">关于胶片漂流计划</h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        这是一个跨越地域、连接心灵的摄影接力项目，让每一张照片都承载着故事与情感
                    </p>
                </motion.div>

                {/* 项目介绍 */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-2xl p-8 shadow-xl mb-16"
                >
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">项目愿景</h2>
                        <p className="text-lg text-gray-600 leading-relaxed">
                            我们相信每一张照片都有故事，每一次拍摄都是成长。通过胶片漂流计划，
                            我们希望连接更多的摄影爱好者，让摄影不仅仅是记录，更是一种生活态度。
                            在接力中传递着对美好生活的向往与追求，让每一棒都成为连接心灵的桥梁。
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 + index * 0.1 }}
                                className="text-center p-6 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 transition-all duration-300"
                            >
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-600 text-white rounded-full mb-4">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                                <p className="text-gray-600">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* 项目流程 */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mb-16"
                >
                    <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">项目流程</h2>
                    <div className="space-y-6">
                        {process.map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 + index * 0.1 }}
                                className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
                            >
                                <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8' : 'pl-8'}`}>
                                    <div className="bg-white rounded-xl p-6 shadow-lg">
                                        <div className="flex items-center mb-3">
                                            <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                                                {item.step}
                                            </div>
                                            {item.title && (
                                                <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                                            )}
                                        </div>
                                        <p className="text-gray-600">{item.description}</p>
                                    </div>
                                </div>

                                {index < process.length - 1 && (
                                    <div className="w-1/2 flex justify-center">
                                        <ArrowRight className={`h-8 w-8 text-purple-400 ${index % 2 === 0 ? '' : 'transform rotate-180'}`} />
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* 点亮全国计划 */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-white rounded-2xl p-8 shadow-xl mb-16"
                >
                    <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">点亮全国计划</h2>
                    <div className="text-center mb-8">
                        <p className="text-lg text-gray-600 leading-relaxed mb-6">
                            继第一期成功举办后，我们正在启动第二期"点亮全国"胶片漂流计划。
                            这一次，我们的目标是覆盖全国所有地级市，让胶片摄影的魅力传遍神州大地。
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-green-50 p-6 rounded-xl border-2 border-green-200">
                                <h3 className="text-xl font-semibold text-green-800 mb-2">浙江站</h3>
                                <p className="text-green-700">已启动</p>
                                <p className="text-sm text-green-600 mt-2">正在火热进行中</p>
                            </div>
                            <div className="bg-yellow-50 p-6 rounded-xl border-2 border-yellow-200">
                                <h3 className="text-xl font-semibold text-yellow-800 mb-2">广东站 & 江苏站</h3>
                                <p className="text-yellow-700">即将启动</p>
                                <p className="text-sm text-yellow-600 mt-2">还差少部分地方</p>
                            </div>
                            <div className="bg-blue-50 p-6 rounded-xl border-2 border-blue-200">
                                <h3 className="text-xl font-semibold text-blue-800 mb-2">其他地区</h3>
                                <p className="text-blue-700">招募中</p>
                                <p className="text-sm text-blue-600 mt-2">欢迎加入</p>
                            </div>
                        </div>
                    </div>
                    <div className="text-center">
                        <p className="text-lg text-gray-600 mb-6">
                            我们欢迎所有热爱摄影的朋友加入，不限参与者身份，共同记录城市变迁与人文风情，
                            建立全国胶片摄影爱好者社区，举办线下交流活动与展览。
                        </p>
                        <button 
                            className="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
                            onClick={() => window.open('https://wj.qq.com/s2/23193149/e58c/', '_blank')}
                        >
                            立即加入
                        </button>
                    </div>
                </motion.div>

                {/* 留言板 */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="mb-16"
                >
                    <MessageBoard 
                        messages={messages}
                        onAddMessage={(newMessage) => {
                            const message: Message = {
                                ...newMessage,
                                id: Date.now().toString(),
                                timestamp: new Date().toLocaleString('zh-CN'),
                                status: 'pending'
                            };
                            setMessages([...messages, message]);
                        }}
                    />
                </motion.div>

                {/* 联系我们 */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="text-center"
                >
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">联系我们</h2>
                    <p className="text-lg text-gray-600 mb-8">
                        如果您对胶片漂流计划感兴趣，或者有任何问题建议，欢迎随时联系我们
                    </p>
                    <div className="flex justify-center space-x-6">
                        <button className="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200">
                            发送邮件
                        </button>
                        <button className="px-8 py-3 border-2 border-purple-600 text-purple-600 rounded-lg hover:bg-purple-600 hover:text-white transition-all duration-200">
                            加入计划
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default About;
