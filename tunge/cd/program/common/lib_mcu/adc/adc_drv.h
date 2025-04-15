/*This file has been prepared for Doxygen automatic documentation generation.*/
//! \file *********************************************************************
//!
//! \brief This file contains the low level macros and definition for the ADC
//!
//! - Compiler:           IAR EWAVR and GNU GCC for AVR
//! - Supported devices:  AT90USB1287, AT90USB1286, AT90USB647, AT90USB646
//!
//! \author               Atmel Corporation: http://www.atmel.com \n
//!                       Support and FAQ: http://support.atmel.no/
//!
//! ***************************************************************************

/* Copyright (c) 2007, Atmel Corporation All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice,
 * this list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 * this list of conditions and the following disclaimer in the documentation
 * and/or other materials provided with the distribution.
 *
 * 3. The name of ATMEL may not be used to endorse or promote products derived
 * from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY ATMEL ``AS IS'' AND ANY EXPRESS OR IMPLIED
 * WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE EXPRESSLY AND
 * SPECIFICALLY DISCLAIMED. IN NO EVENT SHALL ATMEL BE LIABLE FOR ANY DIRECT,
 * INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
 * THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

#ifndef ADC_DRV_H
#define ADC_DRV_H

//_____ I N C L U D E S ____________________________________________________

#ifndef  ADHSM
#define  ADHSM   7
#endif

//! @defgroup ADC_module ADC Module
//! ADC Module
//! @{
//_____ M A C R O S ________________________________________________________

   //! @defgroup ADC_macros ADC Macros
   //! Low level macros that permit the use of the ADC of the product.
   //! @{

      //! @defgroup Turn_on_adc Turn on the ADC
      //! Turn on the ADC
      //! @{
#define Enable_adc()                         (ADCSRA |= (1<<ADEN))
      //! @}

      //! @defgroup ADC_alignement_configuration ADC Alignement Configuration
      //! Configure the Result alignement
      //! @{
#define Right_adjust_adc_result()            (ADMUX  &= ~(1<<ADLAR))
#define Left_adjust_adc_result()             (ADMUX  |=  (1<<ADLAR))
      //! @}

      //! @defgroup ADC_high_speed_mode_configuration ADC High Speed Mode Configuration
      //! Set the high spped mode in case ADC frequency is higher than 200KHz
      //! @{
#define Enable_adc_high_speed_mode()         (ADCSRB |=  (1<<ADHSM))
#define Disable_adc_high_speed_mode()        (ADCSRB &= ~(1<<ADHSM))
      //! @}

         //! @defgroup ADC_digital_input
         //! Disable the digital input buffers for ADC pins in use.
         //! If debugging, only disable pins not used by JTAG
         //! @{
#if (DEBUG == 0)
   #define Disable_digital_input()                   (DIDR0 |= 0xFF)
#else
   #define Disable_digital_input()                   (DIDR0 |= ((1<<ADC1D) \
                                                               |(1<<ADC2D)))
#endif
         //! @}

      //! @defgroup ADC_vref_configuration ADC Vref Configuration
      //! Configure the Vref
      //! @{
#define Enable_internal_vref()               (ADMUX  |=  ((1<<REFS1)|(1<<REFS0)) )
#define Enable_external_vref()               (ADMUX  &= ~((1<<REFS1)|(1<<REFS0)) )
#define Enable_vcc_vref()                    (ADMUX  &= ~(1<<REFS1),          \
                                              ADMUX  |=  (1<<REFS0) )
      //! @}

      //! @defgroup ADC_it_configuration ADC IT Configuration
      //! Configure the ADC IT
      //! @{
#define Enable_all_it()                      (SREG   |=  (0x80) )
#define Disable_all_it()                     (SREG   &= ~(0x80) )
#define Enable_adc_it()                      (ADCSRA |=  (1<<ADIE) )
#define Disable_adc_it()                     (ADCSRA |= ~(1<<ADIE) )
#define Clear_adc_flag()                     (ADCSRA &=  (1<<ADIF) )
#define Clear_adc_adif()                     (ADCSRA |=  (1<<ADIF) )
      //! @}

      //! @defgroup ADC_prescaler_configuration ADC Prescaler Configuration
      //! Configure the ADC prescaler
      //! @{
#define Set_prescaler(prescaler)             (ADCSRA &= ~((1<<ADPS2)|(1<<ADPS1)|(1<<ADPS0)),\
                                              ADCSRA |=  (prescaler) )
      //! @}

      //! @defgroup ADC_channel_selection ADC Channel Selection
      //! Select the ADC channel to be converted
      //! @{
#define Clear_adc_mux()                      (ADMUX  &= ~((1<<MUX3)|(1<<MUX2)|(1<<MUX1)|(1<<MUX0)) )
#define Select_adc_channel(channel)          (Clear_adc_mux(), ADMUX |= (channel) )
      //! @}

      //! @defgroup ADC_start_conversion ADC Start Conversion
      //! Start the Analog to Digital Conversion
      //! @{

         //! @defgroup ADC_start_normal_conversion ADC Start Normal Conversion
         //! Start the conversion in normal mode
         //! @{
#define Start_conv()                          (ADCSRA |= (1<<ADSC) )
#define Start_conv_channel(channel)           (Select_adc_channel(channel), Start_conv() )
#define Start_amplified_conv()                (ADCSRB |= (1<<ADASCR) )
#define Stop_amplified_conv()                 (ADCSRB &= ~(1<<ADASCR) )
#define Start_amplified_conv_channel(channel) (Select_adc_channel(channel), Start_amplified_conv() )
         //! @}

         //! @defgroup ADC_start_idle_conversion ADC Start Idle Conversion
         //! Start the Analog to Digital Conversion in noise reduction mode
         //! @{
#define Start_conv_idle()                    (SMCR   |=  (1<<SM0)|(1<<SE) )
#define Start_conv_idle_channel(channel)     (Select_adc_channel(channel), Start_conv_idle() )
#define Clear_sleep_mode()                   (SMCR   &= ~(1<<SM0)|(1<<SE) )
         //! @}

      //! @}

      //! @defgroup ADC_get_x_bits_result ADC Get x Bits Result
      //! ADC Get x Bits Result
      //! @{
#define Adc_get_8_bits_result()               ((U8)(ADCH))
#define Adc_get_10_bits_result()              ((U16)(ADCL+((U16)(ADCH<<8))))
      //! @}


      //! @defgroup Turn_off_adc Turn Off or on the ADC
      //! Turn Off or on the ADC
      //! @{
#define Disable_adc()                        (ADCSRA &= ~(1<<ADEN))
#define  Enable_adc()                        (ADCSRA |= (1<<ADEN))
      //! @}

      //! @defgroup Check conversion is finished or not
      //! Check conversion status
      //! @{
#define Is_adc_conv_finished()               ((ADCSRA &  (1<<ADIF)) ? TRUE : FALSE)
#define Is_adc_conv_not_finished()           ((ADCSRA | ~(1<<ADIF)) ? TRUE : FALSE)
      //! @}


   //! @}

//_____ D E F I N I T I O N S ______________________________________________

//_____ F U N C T I O N S __________________________________________________
   //! @defgroup ADC_low_level_functions ADC Low Level Fucntions
   //! ADC Low Level Functions
   //! @{

//! Configures the ADC accordingly to the ADC Define Configuration values.
//! Take care that you have to select the ports which will be converted as
//! analog inputs thanks to the DIDR0 and DIDR1 registers.
//!
void init_adc(void);
   //! @}

//! @}

#endif  // ADC_DRV_H
