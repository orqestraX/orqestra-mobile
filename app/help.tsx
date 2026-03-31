import {
  View, Text, TouchableOpacity, TextInput,
  FlatList, KeyboardAvoidingView, Platform, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useRef, useEffect } from 'react';
import { router } from 'expo-router';
import { getAgentReply, getWelcomeMessage, generateId, type Message } from '@/src/agents/helpAgent';

const TYPING_DELAY_MS = 900;

function AgentBubble({ message }: { message: Message }) {
  return (
    <View className="flex-row items-end mb-4 max-w-[85%]">
      <View className="w-8 h-8 rounded-full bg-[#1E3A23] border border-[#4ADE80]/30 items-center justify-center mr-2 flex-shrink-0">
        <Text className="text-sm">🤖</Text>
      </View>
      <View className="flex-1">
        <View className="bg-[#0F1A12] border border-[#1E3A23] rounded-2xl rounded-bl-sm px-4 py-3">
          <Text className="text-white text-sm leading-5">{message.text}</Text>
        </View>
        <Text className="text-gray-600 text-xs mt-1 ml-1">
          Orq · {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    </View>
  );
}

function UserBubble({ message }: { message: Message }) {
  return (
    <View className="flex-row justify-end mb-4">
      <View className="max-w-[80%]">
        <View className="bg-[#4ADE80] rounded-2xl rounded-br-sm px-4 py-3">
          <Text className="text-[#070D09] text-sm font-medium leading-5">{message.text}</Text>
        </View>
        <Text className="text-gray-600 text-xs mt-1 mr-1 text-right">
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    </View>
  );
}

function TypingIndicator() {
  return (
    <View className="flex-row items-end mb-4 max-w-[85%]">
      <View className="w-8 h-8 rounded-full bg-[#1E3A23] border border-[#4ADE80]/30 items-center justify-center mr-2 flex-shrink-0">
        <Text className="text-sm">🤖</Text>
      </View>
      <View className="bg-[#0F1A12] border border-[#1E3A23] rounded-2xl rounded-bl-sm px-4 py-3 flex-row gap-1 items-center">
        {[0, 1, 2].map(i => (
          <View key={i} className="w-1.5 h-1.5 rounded-full bg-gray-500" />
        ))}
      </View>
    </View>
  );
}

export default function HelpScreen() {
  const [messages, setMessages] = useState<Message[]>([getWelcomeMessage()]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const scrollToBottom = () => {
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
  };

  useEffect(() => { scrollToBottom(); }, [messages, isTyping]);

  const sendMessage = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isTyping) return;
    setInput('');

    const userMsg: Message = {
      id: generateId(),
      role: 'user',
      text: trimmed,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    // Simulate agent thinking then reply
    const delay = TYPING_DELAY_MS + Math.random() * 600;
    setTimeout(() => {
      const reply = getAgentReply(trimmed);
      const agentMsg: Message = {
        id: generateId(),
        role: 'agent',
        text: reply.text,
        timestamp: new Date(),
        quickReplies: reply.quickReplies,
      };
      setMessages(prev => [...prev, agentMsg]);
      setIsTyping(false);
    }, delay);
  };

  const lastAgentMessage = [...messages].reverse().find(m => m.role === 'agent');
  const quickReplies = isTyping ? [] : (lastAgentMessage?.quickReplies ?? []);

  return (
    <SafeAreaView className="flex-1 bg-[#070D09]">
      {/* Header */}
      <View className="flex-row items-center px-5 pt-2 pb-4 border-b border-[#1E3A23]">
        <TouchableOpacity onPress={() => router.back()} className="mr-3">
          <Text className="text-[#4ADE80] text-lg">← Back</Text>
        </TouchableOpacity>
        <View className="w-9 h-9 rounded-full bg-[#1E3A23] border border-[#4ADE80]/30 items-center justify-center mr-3">
          <Text>🤖</Text>
        </View>
        <View className="flex-1">
          <Text className="text-white font-bold">Orq — Help Desk</Text>
          <View className="flex-row items-center">
            <View className="w-1.5 h-1.5 rounded-full bg-green-400 mr-1.5" />
            <Text className="text-green-400 text-xs">Online · Replies instantly</Text>
          </View>
        </View>
      </View>

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        {/* Messages */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={m => m.id}
          className="flex-1 px-5"
          contentContainerStyle={{ paddingTop: 16, paddingBottom: 8 }}
          renderItem={({ item }) =>
            item.role === 'user'
              ? <UserBubble message={item} />
              : <AgentBubble message={item} />
          }
          ListFooterComponent={isTyping ? <TypingIndicator /> : null}
          onContentSizeChange={scrollToBottom}
        />

        {/* Quick Replies */}
        {quickReplies.length > 0 && (
          <View className="px-5 pb-2">
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={quickReplies}
              keyExtractor={q => q}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => sendMessage(item)}
                  className="mr-2 px-3 py-2 rounded-full border border-[#4ADE80]/40 bg-[#4ADE80]/10"
                  activeOpacity={0.7}
                >
                  <Text className="text-[#4ADE80] text-xs font-medium">{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )}

        {/* Input */}
        <View className="flex-row items-center px-4 py-3 border-t border-[#1E3A23] gap-2">
          <View className="flex-1 flex-row items-center bg-[#0F1A12] border border-[#1E3A23] rounded-2xl px-4 py-3">
            <TextInput
              value={input}
              onChangeText={setInput}
              placeholder="Ask anything about Orqestra..."
              placeholderTextColor="#4B5563"
              className="flex-1 text-white text-sm"
              multiline
              maxLength={500}
              onSubmitEditing={() => sendMessage(input)}
              blurOnSubmit
            />
          </View>
          <TouchableOpacity
            onPress={() => sendMessage(input)}
            disabled={!input.trim() || isTyping}
            className={`w-11 h-11 rounded-full items-center justify-center ${input.trim() && !isTyping ? 'bg-[#4ADE80]' : 'bg-[#1E3A23]'}`}
            activeOpacity={0.8}
          >
            {isTyping
              ? <ActivityIndicator size="small" color="#4ADE80" />
              : <Text className={`text-lg ${input.trim() ? 'text-[#070D09]' : 'text-gray-600'}`}>↑</Text>
            }
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
