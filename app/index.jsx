import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  FlatList,
  Appearance
} from "react-native";

import { useState, useContext } from 'react';

import { ThemeContext } from "@/context/ThemeContext";

import { data } from '@/data/todos';

import { Colors } from '@/constants/Colors'

import { SafeAreaView } from "react-native-safe-area-context";

import {Montserrat_500Medium, useFonts} from '@expo-google-fonts/montserrat';

import AntDesign from '@expo/vector-icons/AntDesign';
import Ionicons from '@expo/vector-icons/Ionicons';
import Feather from '@expo/vector-icons/Feather';


export default function Index() {

  const [todos, setTodos] = useState(data.sort((a,b) => b.id - a.id));
  const [text, setText] = useState('');

  const [loaded, error] = useFonts({Montserrat_500Medium})

  if(!loaded && !error) return null

  const {colorScheme, setColorScheme, theme} = useContext(ThemeContext)

  const styles = createStyles(theme, colorScheme)

  const addToDo = () => {
    if(text.trim()) {
      const newId = todos.length > 0? todos[0].id + 1 : 1;
      setTodos([{id: newId, title: text, completed: false}, ...todos]);
      setText('');
    }
  }

  const toggleToDo = id => {
    setTodos(todos.map( todo => todo.id === id? {...todo, completed: !todo.completed} : todo));

  }

  const removeToDo = id => {
    setTodos(todos.filter ( todo => todo.id !== id))
  }

  const renderItem = ({item}) => (
    <View style={styles.toDoItem}>
      <Text
        style={[styles.toDoText, item.completed && styles.completedText]}
        onPress={() => toggleToDo(item.id)}
      >
        {item.title}
      </Text>
      <Pressable onPress={() => removeToDo(item.id)}>
        <AntDesign name="delete" size={24} color="red" selectable={undefined} />
      </Pressable>
    </View>      
  )
  
  return (
    <SafeAreaView style={ styles.container }>
      <View style={ styles.inputContainer }>
        <TextInput
          name={"title"}
          style={ styles.input }
          placeholder="Type your task here..."
          placeholderTextColor={theme.text}
          value={ text }
          onChangeText={setText}
        />
        <Pressable
          onPress={addToDo}
          style={styles.addButton}
        >
          <Text
            style={styles.addButtonText}
          >
          Save
          </Text>
        </Pressable>

        <Pressable onPress={() => setColorScheme(colorScheme === 'light'
          ? 'dark'
          : 'light'
        )} style={{marginLeft: 10}}>
          {colorScheme === 'dark'
            ? <Ionicons name="sunny-outline" size={24} color={theme.solIcon} selectable={undefined} />
            : <Feather name="moon" size={24} color={theme.text} selectable={undefined} />
          }
        </Pressable>  
      </View>

      <FlatList
        data={todos}
        renderItem={renderItem}
        keyExtractor={todo => todo.id}
        contentContainerStyle={{ flexGrow: 1 }}
      />
    </SafeAreaView>
  )
}

function createStyles(theme, colorScheme) {
  return StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.background
      },

      inputContainer: {
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
        width: '100%',
        maxWidth: 1024,
        padding: 10,
        marginVertical: 10,
        marginHorizontal: 'auto',
        pointerEvents: 'auto'
      },

      input: {
        flex: 1,
        width: '100%',
        borderColor: theme.borderColor,
        borderBottomWidth: 1,
        height: 50,
        color: theme.text,
        paddingHorizontal: 10,
        fontSize: 20,
        outsetInline: 'none',
        placeholderTextColor: theme.text
      },

      addButton: {
        width: 100,
        padding: 5,
        borderRadius: 10,
        height: 50,
        backgroundColor: theme.button,
        justifyContent: 'center',
        alignItems: 'center'
      },

      addButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 15,
        textTransform: 'uppercase'
      },

      toDoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 4,
        padding: 10,
        borderBottomColor: theme.borderBottomColor,
        borderBottomWidth: 1,
        borderStyle: 'dashed',
        flex: 1,
        maxWidth: 1024,
        marginHorizontal: 'auto',
        pointerEvents: 'auto',
      },

      toDoText: {
        flex: 1,
        fontSize: 18,
        color: theme.text,
        fontFamily: 'Montserrat_500Medium'
      },

      completedText: {
        textDecorationLine: 'line-through',
        color: 'gray',
      }
  })
}