namespace we {
  export namespace di {
    export enum WinType {
      NONE,
      DRAGON,
      TIGER,
      TIE,
    }

    export const BetField = {
      DIRECT_0: 'DIRECT_0',
      DIRECT_1: 'DIRECT_1',
      DIRECT_2: 'DIRECT_2',
      DIRECT_3: 'DIRECT_3',
      DIRECT_4: 'DIRECT_4',
      DIRECT_5: 'DIRECT_5',
      DIRECT_6: 'DIRECT_6',
      DIRECT_7: 'DIRECT_7',
      DIRECT_8: 'DIRECT_8',
      DIRECT_9: 'DIRECT_9',
      DIRECT_10: 'DIRECT_10',
      DIRECT_11: 'DIRECT_11',
      DIRECT_12: 'DIRECT_12',
      DIRECT_13: 'DIRECT_13',
      DIRECT_14: 'DIRECT_14',
      DIRECT_15: 'DIRECT_15',
      DIRECT_16: 'DIRECT_16',
      DIRECT_17: 'DIRECT_17',
      DIRECT_18: 'DIRECT_18',
      DIRECT_19: 'DIRECT_19',
      DIRECT_20: 'DIRECT_20',
      DIRECT_21: 'DIRECT_21',
      DIRECT_22: 'DIRECT_22',
      DIRECT_23: 'DIRECT_23',
      DIRECT_24: 'DIRECT_24',
      DIRECT_25: 'DIRECT_25',
      DIRECT_26: 'DIRECT_26',
      DIRECT_27: 'DIRECT_27',
      DIRECT_28: 'DIRECT_28',
      DIRECT_29: 'DIRECT_29',
      DIRECT_30: 'DIRECT_30',
      DIRECT_31: 'DIRECT_31',
      DIRECT_32: 'DIRECT_32',
      DIRECT_33: 'DIRECT_33',
      DIRECT_34: 'DIRECT_34',
      DIRECT_35: 'DIRECT_35',
      DIRECT_36: 'DIRECT_36',
      SEPARATE_1_2: 'SEPARATE_1_2',
      SEPARATE_2_3: 'SEPARATE_2_3',
      SEPARATE_4_5: 'SEPARATE_4_5',
      SEPARATE_5_6: 'SEPARATE_5_6',
      SEPARATE_7_8: 'SEPARATE_7_8',
      SEPARATE_8_9: 'SEPARATE_8_9',
      SEPARATE_10_11: 'SEPARATE_10_11',
      SEPARATE_11_12: 'SEPARATE_11_12',
      SEPARATE_13_14: 'SEPARATE_13_14',
      SEPARATE_14_15: 'SEPARATE_14_15',
      SEPARATE_16_17: 'SEPARATE_16_17',
      SEPARATE_17_18: 'SEPARATE_17_18',
      SEPARATE_19_20: 'SEPARATE_19_20',
      SEPARATE_20_21: 'SEPARATE_20_21',
      SEPARATE_22_23: 'SEPARATE_22_23',
      SEPARATE_23_24: 'SEPARATE_23_24',
      SEPARATE_25_26: 'SEPARATE_25_26',
      SEPARATE_26_27: 'SEPARATE_26_27',
      SEPARATE_28_29: 'SEPARATE_28_29',
      SEPARATE_29_30: 'SEPARATE_29_30',
      SEPARATE_31_32: 'SEPARATE_31_32',
      SEPARATE_32_33: 'SEPARATE_32_33',
      SEPARATE_34_35: 'SEPARATE_34_35',
      SEPARATE_35_36: 'SEPARATE_35_36',
      SEPARATE_0_1: 'SEPARATE_0_1',
      SEPARATE_0_2: 'SEPARATE_0_2',
      SEPARATE_0_3: 'SEPARATE_0_3',
      SEPARATE_1_4: 'SEPARATE_1_4',
      SEPARATE_2_5: 'SEPARATE_2_5',
      SEPARATE_3_6: 'SEPARATE_3_6',
      SEPARATE_4_7: 'SEPARATE_4_7',
      SEPARATE_5_8: 'SEPARATE_5_8',
      SEPARATE_6_9: 'SEPARATE_6_9',
      SEPARATE_7_10: 'SEPARATE_7_10',
      SEPARATE_8_11: 'SEPARATE_8_11',
      SEPARATE_9_12: 'SEPARATE_9_12',
      SEPARATE_10_13: 'SEPARATE_10_13',
      SEPARATE_11_14: 'SEPARATE_11_14',
      SEPARATE_12_15: 'SEPARATE_12_15',
      SEPARATE_13_16: 'SEPARATE_13_16',
      SEPARATE_14_17: 'SEPARATE_14_17',
      SEPARATE_15_18: 'SEPARATE_15_18',
      SEPARATE_16_19: 'SEPARATE_16_19',
      SEPARATE_17_20: 'SEPARATE_17_20',
      SEPARATE_18_21: 'SEPARATE_18_21',
      SEPARATE_19_22: 'SEPARATE_19_22',
      SEPARATE_20_23: 'SEPARATE_20_23',
      SEPARATE_21_24: 'SEPARATE_21_24',
      SEPARATE_22_25: 'SEPARATE_22_25',
      SEPARATE_23_26: 'SEPARATE_23_26',
      SEPARATE_24_27: 'SEPARATE_24_27',
      SEPARATE_25_28: 'SEPARATE_25_28',
      SEPARATE_26_29: 'SEPARATE_26_29',
      SEPARATE_27_30: 'SEPARATE_27_30',
      SEPARATE_28_31: 'SEPARATE_28_31',
      SEPARATE_29_32: 'SEPARATE_29_32',
      SEPARATE_30_33: 'SEPARATE_30_33',
      SEPARATE_31_34: 'SEPARATE_31_34',
      SEPARATE_32_35: 'SEPARATE_32_35',
      SEPARATE_33_36: 'SEPARATE_33_36',
      STREET_1_2_3: 'STREET_1_2_3',
      STREET_4_5_6: 'STREET_4_5_6',
      STREET_7_8_9: 'STREET_7_8_9',
      STREET_10_11_12: 'STREET_10_11_12',
      STREET_13_14_15: 'STREET_13_14_15',
      STREET_16_17_18: 'STREET_16_17_18',
      STREET_19_20_21: 'STREET_19_20_21',
      STREET_22_23_24: 'STREET_22_23_24',
      STREET_25_26_27: 'STREET_25_26_27',
      STREET_28_29_30: 'STREET_28_29_30',
      STREET_31_32_33: 'STREET_31_32_33',
      STREET_34_35_36: 'STREET_34_35_36',
      STREET_0_1_2: 'STREET_0_1_2',
      STREET_0_2_3: 'STREET_0_2_3',
      CORNER_1_2_4_5: 'CORNER_1_2_4_5',
      CORNER_2_3_5_6: 'CORNER_2_3_5_6',
      CORNER_4_5_7_8: 'CORNER_4_5_7_8',
      CORNER_5_6_8_9: 'CORNER_5_6_8_9',
      CORNER_7_8_10_11: 'CORNER_7_8_10_11',
      CORNER_8_9_11_12: 'CORNER_8_9_11_12',
      CORNER_10_11_13_14: 'CORNER_10_11_13_14',
      CORNER_11_12_14_15: 'CORNER_11_12_14_15',
      CORNER_13_14_16_17: 'CORNER_13_14_16_17',
      CORNER_14_15_17_18: 'CORNER_14_15_17_18',
      CORNER_16_17_19_20: 'CORNER_16_17_19_20',
      CORNER_17_18_20_21: 'CORNER_17_18_20_21',
      CORNER_19_20_22_23: 'CORNER_19_20_22_23',
      CORNER_20_21_23_24: 'CORNER_20_21_23_24',
      CORNER_22_23_25_26: 'CORNER_22_23_25_26',
      CORNER_23_24_26_27: 'CORNER_23_24_26_27',
      CORNER_25_26_28_29: 'CORNER_25_26_28_29',
      CORNER_26_27_29_30: 'CORNER_26_27_29_30',
      CORNER_28_29_31_32: 'CORNER_28_29_31_32',
      CORNER_29_30_32_33: 'CORNER_29_30_32_33',
      CORNER_31_32_34_35: 'CORNER_31_32_34_35',
      CORNER_32_33_35_36: 'CORNER_32_33_35_36',
      CORNER_0_1_2_3: 'CORNER_0_1_2_3',
      LINE_1_6: 'LINE_1_6', // 1_2_3_4_5_6
      LINE_4_9: 'LINE_4_9', // 4_5_6_7_8_9
      LINE_7_12: 'LINE_7_12', // 7_8_9_10_11_12
      LINE_10_15: 'LINE_10_15', // 10_11_12_13_14_15
      LINE_13_18: 'LINE_13_18', // 13_14_15_16_17_18
      LINE_16_21: 'LINE_16_21', // 16_17_18_19_20_21
      LINE_19_24: 'LINE_19_24', // 19_20_21_22_23_24
      LINE_22_27: 'LINE_22_27', // 22_23_24_25_26_27
      LINE_25_30: 'LINE_25_30', // 25_26_27_28_29_30
      LINE_28_33: 'LINE_28_33', // 28_29_30_31_32_33
      LINE_31_36: 'LINE_31_36', // 31_32_33_34_35_36
      ROW_1: 'ROW_1', // 1_4_7_10_13_16_19_22_25_28_31_34
      ROW_2: 'ROW_2', // 2_5_8_11_14_17_20_23_26_29_32_35
      ROW_3: 'ROW_3', // 3_6_9_12_15_18_21_24_27_30_33_36
      DOZEN_1_12: 'DOZEN_1_12', // 1_2_3_4_5_6_7_8_9_10_11_12
      DOZEN_13_24: 'DOZEN_13_24', // 13_14_15_16_17_18_19_20_21_22_23_24
      DOZEN_25_36: 'DOZEN_25_36', // 25_26_27_28_29_30_31_32_33_34_35_36
      RED: 'RED', // 1_3_5_7_9_12_14_16_18_19_21_23_25_27_30_32_34_36
      BLACK: 'BLACK', // 2_4_6_8_10_11_13_15_17_20_22_24_26_28_29_31_33_35
      ODD: 'ODD', // 1_3_5_7_9_11_13_15_17_19_21_23_25_27_29_31_33_35
      EVEN: 'EVEN', // 2_4_6_8_10_12_14_16_18_20_22_24_26_28_30_32_34_36
      SMALL: 'SMALL', // 1_2_3_4_5_6_7_8_9_10_11_12_13_14_15_16_17_18
      BIG: 'BIG', // 19_20_21_22_23_24_25_26_27_28_29_30_31_32_33_34_35_36
    };
  }
}
