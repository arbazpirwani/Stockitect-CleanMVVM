import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Modal,
    ScrollView,
    Dimensions,
    Animated,
    Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';
import { Stock } from '@appTypes/stock';
import { colors, typography, spacing, borderRadius } from '@/theme';

interface StockDetailsBottomSheetProps {
    stock: Stock | null;
    visible: boolean;
    onClose: () => void;
}

export const StockDetailsBottomSheet: React.FC<StockDetailsBottomSheetProps> = ({
                                                                                    stock,
                                                                                    visible,
                                                                                    onClose,
                                                                                }) => {
    const { t } = useTranslation();
    const windowHeight = Dimensions.get('window').height;
    const animatedValue = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        if (visible) {
            Animated.timing(animatedValue, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(animatedValue, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }).start();
        }
    }, [visible, animatedValue]);

    const translateY = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [windowHeight, 0],
    });

    if (!stock) return null;

    const DetailItem = ({ label, value }: { label: string; value: string | number | undefined }) => {
        if (value === undefined) return null;

        return (
            <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>{label}</Text>
                <Text style={styles.detailValue}>{value}</Text>
            </View>
        );
    };

    const TagItem = ({ label }: { label: string }) => {
        return (
            <View style={styles.tag}>
                <Text style={styles.tagText}>{label}</Text>
            </View>
        );
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="none"
            statusBarTranslucent
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                <TouchableOpacity
                    style={styles.overlay}
                    activeOpacity={1}
                    onPress={onClose}
                    testID="close-overlay"
                />

                <Animated.View
                    style={[
                        styles.bottomSheet,
                        { transform: [{ translateY }] },
                    ]}
                >
                    <View style={styles.handle} />

                    <View style={styles.header}>
                        <View style={styles.tickerContainer}>
                            <Text style={styles.tickerText}>{stock.ticker}</Text>
                        </View>
                        <Text style={styles.companyName}>{stock.name}</Text>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={onClose}
                            testID="close-button"
                        >
                            <Icon name="close" size={24} color={colors.text.secondary} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.content}>
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>{t('stockDetails.details')}</Text>
                            <View style={styles.detailsContainer}>
                                <DetailItem label={t('stockDetails.exchange')} value={stock.exchange} />
                                <DetailItem label={t('stockDetails.type')} value={stock.type} />
                                <DetailItem
                                    label={t('stockDetails.marketCap')}
                                    value={stock.marketCap ?
                                        `$${(stock.marketCap / 1000000000).toFixed(2)}B` :
                                        t('stockDetails.notAvailable')
                                    }
                                />
                                <DetailItem label={t('stockDetails.currency')} value={stock.currency} />
                            </View>
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>{t('stockDetails.tags')}</Text>
                            <View style={styles.tagsContainer}>
                                {stock.exchange && <TagItem label={stock.exchange} />}
                                {stock.type && <TagItem label={stock.type} />}
                                {stock.currency && <TagItem label={stock.currency} />}
                                <TagItem label={t('stockDetails.active')} />
                            </View>
                        </View>
                    </ScrollView>
                </Animated.View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    overlay: {
        flex: 1,
    },
    bottomSheet: {
        backgroundColor: colors.secondary,
        borderTopLeftRadius: borderRadius.large,
        borderTopRightRadius: borderRadius.large,
        paddingBottom: Platform.OS === 'ios' ? 34 : 24,
        maxHeight: '80%',
    },
    handle: {
        width: 40,
        height: 5,
        backgroundColor: colors.stockItem.border,
        borderRadius: borderRadius.round,
        alignSelf: 'center',
        marginTop: spacing.m,
        marginBottom: spacing.s,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.l,
        paddingBottom: spacing.m,
        borderBottomWidth: 1,
        borderBottomColor: colors.stockItem.border,
    },
    tickerContainer: {
        backgroundColor: colors.primary,
        paddingHorizontal: spacing.s,
        paddingVertical: spacing.xs,
        borderRadius: borderRadius.small,
        marginRight: spacing.s,
    },
    tickerText: {
        ...typography.subtitle,
        color: colors.secondary,
        fontWeight: 'bold',
    },
    companyName: {
        ...typography.body,
        flex: 1,
        color: colors.text.primary,
        fontWeight: '600',
    },
    closeButton: {
        padding: spacing.xs,
    },
    content: {
        paddingHorizontal: spacing.l,
        marginTop: spacing.m,
    },
    section: {
        marginBottom: spacing.l,
    },
    sectionTitle: {
        ...typography.subtitle,
        color: colors.text.primary,
        marginBottom: spacing.s,
    },
    detailsContainer: {
        backgroundColor: colors.light,
        borderRadius: borderRadius.medium,
        padding: spacing.m,
        marginVertical: spacing.xs,
        borderWidth: 1,
        borderColor: colors.stockItem.border,
    },
    detailItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: spacing.s,
    },
    detailLabel: {
        ...typography.body,
        color: colors.text.secondary,
    },
    detailValue: {
        ...typography.body,
        color: colors.text.primary,
        fontWeight: '500',
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    tag: {
        backgroundColor: colors.info,
        borderRadius: borderRadius.round,
        paddingHorizontal: spacing.m,
        paddingVertical: spacing.xs,
        marginRight: spacing.s,
        marginBottom: spacing.s,
    },
    tagText: {
        ...typography.caption,
        color: colors.secondary,
        fontWeight: '500',
    },
});