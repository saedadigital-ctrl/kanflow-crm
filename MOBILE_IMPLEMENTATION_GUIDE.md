# 📱 Guia de Implementação Mobile - KanFlow CRM

## 🎯 Objetivo

Fornecer um guia passo-a-passo completo para implementar a versão mobile do KanFlow CRM, incluindo fluxos de usuário, exemplos de código e melhores práticas.

---

## 🚀 Início Rápido

### **Passo 1: Criar Projeto React Native**

```bash
# Usando Expo (recomendado para MVP)
npx create-expo-app kanflow-mobile
cd kanflow-mobile

# Ou usando React Native CLI
npx react-native init kanflow-mobile
cd kanflow-mobile
```

### **Passo 2: Instalar Dependências Principais**

```bash
# UI Components
npm install react-native-paper

# Navegação
npm install @react-navigation/native @react-navigation/bottom-tabs @react-navigation/stack
npm install react-native-screens react-native-safe-area-context

# Estado
npm install @reduxjs/toolkit react-redux

# API
npm install @trpc/client superjson

# Banco de Dados Local
npm install watermelondb @nozbe/watermelondb

# Sincronização
npm install replicache

# Utilitários
npm install axios lodash date-fns
```

### **Passo 3: Estrutura de Pastas**

```bash
mkdir -p src/{screens,components,hooks,store,services,db,utils,navigation,theme}
```

---

## 🔐 Autenticação

### **Fluxo de Login**

```
┌─────────────────────────────────────────┐
│ Tela de Login                           │
├─────────────────────────────────────────┤
│                                         │
│ Email: [________________]                │
│ Senha: [________________]                │
│                                         │
│ [Entrar]  [Criar Conta]                 │
│                                         │
│ [Esqueci Minha Senha]                   │
│                                         │
└─────────────────────────────────────────┘
        ↓
   Validação Local
        ↓
   Chamada OAuth
        ↓
   Salvar Token
        ↓
   Ir para Dashboard
```

### **Implementação de Login**

```typescript
// screens/auth/LoginScreen.tsx
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { setUser } from '../../store/slices/authSlice';
import { authService } from '../../services/auth';

export function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const dispatch = useDispatch();

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Preencha todos os campos');
      return;
    }

    setLoading(true);
    try {
      const response = await authService.login(email, password);
      dispatch(setUser(response.user));
      // Navegar para Dashboard
      navigation.reset({
        index: 0,
        routes: [{ name: 'MainStack' }],
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="displaySmall" style={styles.title}>
        KanFlow CRM
      </Text>

      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        style={styles.input}
        editable={!loading}
      />

      <TextInput
        label="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
        editable={!loading}
      />

      {error && <Text style={styles.error}>{error}</Text>}

      <Button
        mode="contained"
        onPress={handleLogin}
        loading={loading}
        disabled={loading}
        style={styles.button}
      >
        Entrar
      </Button>

      <Button
        mode="text"
        onPress={() => navigation.navigate('ForgotPassword')}
        style={styles.link}
      >
        Esqueci minha senha
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
    marginBottom: 32,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 16,
    paddingVertical: 8,
  },
  link: {
    marginTop: 16,
  },
  error: {
    color: '#EF4444',
    marginBottom: 8,
  },
});
```

---

## 📊 Dashboard

### **Fluxo de Dashboard**

```
┌─────────────────────────────────────────┐
│ 👋 Olá, João!              [⚙️]        │
├─────────────────────────────────────────┤
│                                         │
│ 📊 Métricas Hoje                        │
│ ┌─────────┬─────────┬─────────┐        │
│ │ 24      │ 12      │ 8       │        │
│ │ Chats   │ Novos   │ Vendas  │        │
│ └─────────┴─────────┴─────────┘        │
│                                         │
│ 🔴 Próximas Ações                       │
│ ├─ Ligar para João Silva                │
│ ├─ Enviar proposta para Maria           │
│ └─ Seguir up com Pedro                  │
│                                         │
│ 📈 Pipeline                             │
│ ├─ 🔴 Qualificação (5)                  │
│ ├─ 🟡 Proposta (3)                      │
│ └─ 🟢 Fechamento (2)                    │
│                                         │
├─────────────────────────────────────────┤
│ [🏠] [👥] [📊] [💬] [⚙️]               │
└─────────────────────────────────────────┘
```

### **Implementação de Dashboard**

```typescript
// screens/main/DashboardScreen.tsx
import React, { useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Card, Text, ActivityIndicator } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { fetchDashboard } from '../../store/slices/dashboardSlice';

export function DashboardScreen() {
  const dispatch = useDispatch();
  const { metrics, loading, error } = useSelector(state => state.dashboard);
  const { user } = useSelector(state => state.auth);

  useEffect(() => {
    dispatch(fetchDashboard());
  }, [dispatch]);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineSmall">
          👋 Olá, {user?.name}!
        </Text>
      </View>

      <Card style={styles.card}>
        <Card.Title title="📊 Métricas Hoje" />
        <Card.Content>
          <View style={styles.metricsGrid}>
            <MetricCard label="Chats" value={metrics?.chats || 0} />
            <MetricCard label="Novos" value={metrics?.newLeads || 0} />
            <MetricCard label="Vendas" value={metrics?.sales || 0} />
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Title title="🔴 Próximas Ações" />
        <Card.Content>
          {metrics?.actions?.map((action, index) => (
            <Text key={index} style={styles.actionItem}>
              • {action}
            </Text>
          ))}
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Title title="📈 Pipeline" />
        <Card.Content>
          {metrics?.pipeline?.map((stage, index) => (
            <View key={index} style={styles.stageItem}>
              <Text>{stage.name} ({stage.count})</Text>
            </View>
          ))}
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

function MetricCard({ label, value }) {
  return (
    <View style={styles.metricCard}>
      <Text variant="headlineMedium">{value}</Text>
      <Text variant="bodySmall">{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F9FAFB',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    marginBottom: 16,
  },
  card: {
    marginBottom: 12,
  },
  metricsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  metricCard: {
    alignItems: 'center',
  },
  actionItem: {
    marginVertical: 4,
  },
  stageItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
});
```

---

## 👥 Contatos

### **Fluxo de Contatos**

```
┌─────────────────────────────────────────┐
│ 👥 Contatos              [🔍] [➕]     │
├─────────────────────────────────────────┤
│ Buscar contatos...                      │
│                                         │
│ 🔴 Qualificação (5)                     │
│ ├─ João Silva                           │
│ │  Vendedor | 📞 (11) 99999-9999        │
│ │  Último: 2h atrás                     │
│ │                                       │
│ ├─ Maria Santos                         │
│ │  Gerente | 📞 (11) 88888-8888         │
│ │  Último: 1d atrás                     │
│ │                                       │
│ └─ Pedro Costa                          │
│    Diretor | 📞 (11) 77777-7777         │
│    Último: 3d atrás                     │
│                                         │
├─────────────────────────────────────────┤
│ [🏠] [👥] [📊] [💬] [⚙️]               │
└─────────────────────────────────────────┘
```

### **Implementação de Contatos**

```typescript
// screens/main/ContactsScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Searchbar, Card, Text, FAB } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { fetchContacts } from '../../store/slices/contactsSlice';

export function ContactsScreen({ navigation }) {
  const dispatch = useDispatch();
  const { contacts, loading } = useSelector(state => state.contacts);
  const [search, setSearch] = useState('');

  useEffect(() => {
    dispatch(fetchContacts());
  }, [dispatch]);

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(search.toLowerCase())
  );

  const renderContact = ({ item }) => (
    <Card
      style={styles.contactCard}
      onPress={() => navigation.navigate('ContactDetail', { id: item.id })}
    >
      <Card.Content>
        <View style={styles.contactHeader}>
          <Text variant="titleMedium">{item.name}</Text>
          <Text variant="bodySmall">{item.role}</Text>
        </View>
        <Text variant="bodySmall" style={styles.phone}>
          📞 {item.phone}
        </Text>
        <Text variant="bodySmall" style={styles.lastContact}>
          Último: {item.lastContact}
        </Text>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Buscar contatos..."
        onChangeText={setSearch}
        value={search}
        style={styles.searchbar}
      />

      <FlatList
        data={filteredContacts}
        renderItem={renderContact}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        scrollEnabled={true}
      />

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate('NewContact')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  searchbar: {
    margin: 16,
  },
  listContent: {
    paddingHorizontal: 16,
  },
  contactCard: {
    marginBottom: 12,
  },
  contactHeader: {
    marginBottom: 8,
  },
  phone: {
    marginVertical: 4,
  },
  lastContact: {
    color: '#6B7280',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 56, // Acima da bottom tab
  },
});
```

---

## 💬 Chats

### **Fluxo de Chats**

```
┌─────────────────────────────────────────┐
│ 💬 Mensagens              [🔍]          │
├─────────────────────────────────────────┤
│                                         │
│ João Silva                    12:30     │
│ Olá, tudo bem?                          │
│                                         │
│ Maria Santos                  11:45     │
│ Quando você pode ligar?                 │
│                                         │
│ Pedro Costa                   10:20     │
│ Enviei a proposta por email              │
│                                         │
├─────────────────────────────────────────┤
│ [🏠] [👥] [📊] [💬] [⚙️]               │
└─────────────────────────────────────────┘
```

### **Implementação de Chat Detail**

```typescript
// screens/details/ChatDetailScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, KeyboardAvoidingView } from 'react-native';
import { TextInput, Button, Text, Avatar } from 'react-native-paper';
import { useRoute } from '@react-navigation/native';
import { chatService } from '../../services/chats';

export function ChatDetailScreen() {
  const route = useRoute();
  const { contactId } = route.params;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadMessages();
  }, [contactId]);

  const loadMessages = async () => {
    try {
      const data = await chatService.getMessages(contactId);
      setMessages(data);
    } catch (error) {
      console.error('Erro ao carregar mensagens:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    setLoading(true);
    try {
      const message = await chatService.sendMessage(contactId, newMessage);
      setMessages([...messages, message]);
      setNewMessage('');
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderMessage = ({ item }) => (
    <View
      style={[
        styles.messageContainer,
        item.isOwn ? styles.ownMessage : styles.otherMessage,
      ]}
    >
      {!item.isOwn && <Avatar.Text size={32} label={item.senderInitials} />}
      <View
        style={[
          styles.messageBubble,
          item.isOwn ? styles.ownBubble : styles.otherBubble,
        ]}
      >
        <Text
          style={[
            styles.messageText,
            item.isOwn ? styles.ownText : styles.otherText,
          ]}
        >
          {item.content}
        </Text>
        <Text
          style={[
            styles.timestamp,
            item.isOwn ? styles.ownTimestamp : styles.otherTimestamp,
          ]}
        >
          {item.timestamp}
        </Text>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.messagesList}
        inverted
      />

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Digite uma mensagem..."
          value={newMessage}
          onChangeText={setNewMessage}
          style={styles.input}
          multiline
          maxLength={500}
          editable={!loading}
        />
        <Button
          icon="send"
          onPress={handleSendMessage}
          loading={loading}
          disabled={!newMessage.trim() || loading}
        >
          Enviar
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  messagesList: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  messageContainer: {
    flexDirection: 'row',
    marginVertical: 8,
    alignItems: 'flex-end',
  },
  ownMessage: {
    justifyContent: 'flex-end',
  },
  otherMessage: {
    justifyContent: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    marginHorizontal: 8,
  },
  ownBubble: {
    backgroundColor: '#2563EB',
  },
  otherBubble: {
    backgroundColor: '#E5E7EB',
  },
  messageText: {
    fontSize: 14,
  },
  ownText: {
    color: 'white',
  },
  otherText: {
    color: '#111827',
  },
  timestamp: {
    fontSize: 11,
    marginTop: 4,
  },
  ownTimestamp: {
    color: 'rgba(255,255,255,0.7)',
  },
  otherTimestamp: {
    color: '#6B7280',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    marginRight: 8,
    maxHeight: 100,
  },
});
```

---

## 🔄 Sincronização Offline

### **Fluxo de Sincronização**

```
┌─────────────────────────────────────────┐
│ Ação do Usuário (Online ou Offline)     │
├─────────────────────────────────────────┤
│                                         │
│ Salvar no SQLite Local                  │
│ ↓                                       │
│ Adicionar à Fila de Sync                │
│ ↓                                       │
│ [Se Online] Sincronizar com Backend     │
│ [Se Offline] Aguardar Conexão           │
│ ↓                                       │
│ Atualizar Redux Store                   │
│ ↓                                       │
│ Re-render UI                            │
│                                         │
└─────────────────────────────────────────┘
```

### **Implementação de Sync**

```typescript
// services/sync.ts
import { useEffect, useCallback } from 'react';
import { useNetInfo } from '@react-native-community/netinfo';
import { useDispatch } from 'react-redux';
import { syncQueue } from '../db/queries';

export function useSyncManager() {
  const netInfo = useNetInfo();
  const dispatch = useDispatch();

  useEffect(() => {
    if (netInfo.isConnected && netInfo.isInternetReachable) {
      performSync();
    }
  }, [netInfo.isConnected, netInfo.isInternetReachable]);

  const performSync = useCallback(async () => {
    try {
      const pendingChanges = await syncQueue.getPending();

      for (const change of pendingChanges) {
        try {
          await syncChange(change);
          await syncQueue.markAsSynced(change.id);
        } catch (error) {
          console.error('Erro ao sincronizar:', error);
          // Manter na fila para tentar depois
        }
      }
    } catch (error) {
      console.error('Erro ao obter mudanças pendentes:', error);
    }
  }, []);

  return {
    isOnline: netInfo.isConnected && netInfo.isInternetReachable,
    performSync,
  };
}

async function syncChange(change) {
  const { type, table, data } = change;

  switch (type) {
    case 'CREATE':
      return await api.post(`/${table}`, data);
    case 'UPDATE':
      return await api.put(`/${table}/${data.id}`, data);
    case 'DELETE':
      return await api.delete(`/${table}/${data.id}`);
  }
}
```

---

## 📋 Checklist de Implementação

### **Fase 1: Setup (1 semana)**

- [ ] Projeto React Native criado
- [ ] Dependências instaladas
- [ ] Navegação configurada
- [ ] Tema customizado
- [ ] Autenticação OAuth implementada

### **Fase 2: MVP (3 semanas)**

- [ ] Dashboard funcional
- [ ] Tela de Contatos
- [ ] Tela de Chats
- [ ] Tela de Pipeline
- [ ] Tela de Perfil

### **Fase 3: Offline (2 semanas)**

- [ ] SQLite configurado
- [ ] WatermelonDB integrado
- [ ] Fila de sincronização
- [ ] Detecção de conexão
- [ ] Sincronização automática

### **Fase 4: Polish (1 semana)**

- [ ] Testes unitários
- [ ] Testes de integração
- [ ] Otimização de performance
- [ ] Tratamento de erros
- [ ] Acessibilidade

### **Fase 5: Deploy (1 semana)**

- [ ] Build para iOS
- [ ] Build para Android
- [ ] Submissão App Store
- [ ] Submissão Google Play
- [ ] Documentação

---

## 🎯 Métricas de Sucesso

| Métrica | Alvo | Método |
|---------|------|--------|
| **Startup Time** | < 3s | React Native Perf |
| **Frame Rate** | 60 FPS | DevTools Profiler |
| **Memory** | < 150MB | Xcode / Android Studio |
| **Battery** | < 5%/hora | Device Monitor |
| **Offline Sync** | 100% | Testes manuais |
| **User Satisfaction** | > 4.5/5 | App Store Reviews |

---

**Versão:** 1.0.0
**Data:** 2025-01-04
**Status:** ✅ Guia Completo
**Assinado:** Manus AI

