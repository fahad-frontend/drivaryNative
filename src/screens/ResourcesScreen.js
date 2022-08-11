//import liraries
import React, { useState, useRef } from 'react'
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native'
import { Transition, Transitioning } from 'react-native-reanimated';
import { resourcesData } from '../utils/Enums'

// create a component
const ResourcesScreen = () => {

    const [currentIndex, setCurrentIndex] = useState(null)
    const ref = useRef()

    const transition = (
        <Transition.Together>
            <Transition.In type='fade' durationMs={200} />
            <Transition.Change />
            <Transition.Out type='fade' durationMs={200} />
        </Transition.Together>
    );

    return (
        <Transitioning.View
            ref={ref}
            transition={transition}
            style={styles.container}
            >
            {resourcesData.map(({ bg, color, category, subCategories }, index) => {
                return (
                <TouchableOpacity
                    key={category}
                    onPress={() => {
                        ref.current.animateNextTransition();
                        setCurrentIndex(index === currentIndex ? null : index);
                    }}
                    style={styles.cardContainer}
                    activeOpacity={0.9}
                >
                    <View style={[styles.card, { backgroundColor: bg }]}>
                    <Text style={[styles.heading, { color }]}>{category}</Text>
                    {index === currentIndex && (
                        <View style={styles.subCategoriesList}>
                        {subCategories.map((subCategory) => (
                            <Text key={subCategory} style={[styles.body, { color }]}>
                            {subCategory}
                            </Text>
                        ))}
                        </View>
                    )}
                    </View>
                </TouchableOpacity>
                );
            })}
        </Transitioning.View>
    )
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
    },
    cardContainer: {
        flexGrow: 1,
    },
    card: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    heading: {
        fontSize: 38,
        fontWeight: '900',
        textTransform: 'uppercase',
        letterSpacing: -2,
    },
    body: {
        fontSize: 20,
        lineHeight: 20 * 1.5,
        textAlign: 'center',
    },
    subCategoriesList: {
        marginTop: 20,
    },
})

//make this component available to the app
export default ResourcesScreen;
