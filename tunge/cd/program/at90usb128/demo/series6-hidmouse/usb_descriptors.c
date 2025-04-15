/*This file has been prepared for Doxygen automatic documentation generation.*/
//! \file *********************************************************************
//!
//! \brief  USB parameters.
//!
//!  This file contains the usb parameters that uniquely identify the
//!  application through descriptor tables.
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


//_____ I N C L U D E S ____________________________________________________

#include "config.h"
#include "conf_usb.h"

#include "lib_mcu/usb/usb_drv.h"
#include "usb_descriptors.h"
#include "modules/usb/device_chap9/usb_standard_request.h"
#include "usb_specific_request.h"
#if ((USB_DEVICE_SN_USE==ENABLE) && (USE_DEVICE_SN_UNIQUE==ENABLE))
#include "lib_mcu/flash/flash_drv.h"
#endif

//_____ M A C R O S ________________________________________________________




//_____ D E F I N I T I O N ________________________________________________

// usb_user_device_descriptor
code S_usb_device_descriptor usb_dev_desc =
{
  sizeof(usb_dev_desc)
, DESCRIPTOR_DEVICE
, Usb_write_word_enum_struc(USB_SPECIFICATION)
, DEVICE_CLASS
, DEVICE_SUB_CLASS
, DEVICE_PROTOCOL
, EP_CONTROL_LENGTH
, Usb_write_word_enum_struc(VENDOR_ID)
, Usb_write_word_enum_struc(PRODUCT_ID)
, Usb_write_word_enum_struc(RELEASE_NUMBER)
, MAN_INDEX
, PROD_INDEX
, SN_INDEX
, NB_CONFIGURATION
};

// usb_user_configuration_descriptor FS
code S_usb_user_configuration_descriptor usb_conf_desc = {
 { sizeof(S_usb_configuration_descriptor)
 , DESCRIPTOR_CONFIGURATION
 , Usb_write_word_enum_struc(sizeof(S_usb_configuration_descriptor)\
       +sizeof(S_usb_interface_descriptor)   \
       +sizeof(S_usb_hid_descriptor)         \
       +sizeof(S_usb_endpoint_descriptor)    \
                              )
 , NB_INTERFACE
 , CONF_NB
 , CONF_INDEX
 , CONF_ATTRIBUTES
 , MAX_POWER
 }
 ,
 { sizeof(S_usb_interface_descriptor)
 , DESCRIPTOR_INTERFACE
 , INTERFACE_NB_MOUSE
 , ALTERNATE_MOUSE
 , NB_ENDPOINT_MOUSE
 , INTERFACE_CLASS_MOUSE
 , INTERFACE_SUB_CLASS_MOUSE
 , INTERFACE_PROTOCOL_MOUSE
 , INTERFACE_INDEX_MOUSE
 }
 ,
 { sizeof(S_usb_hid_descriptor)
 , DESCRIPTOR_HID
 , HID_BDC
 , HID_NO_COUNTRY_CODE
 , HID_CLASS_DESC_NB_DEFAULT
 , DESCRIPTOR_REPORT
 , Usb_write_word_enum_struc(sizeof(S_usb_hid_report_descriptor_mouse))
 }
 ,
 { sizeof(S_usb_endpoint_descriptor)
 , DESCRIPTOR_ENDPOINT
 , ENDPOINT_NB_1
 , EP_ATTRIBUTES_1
 , Usb_write_word_enum_struc(EP_SIZE_1)
 , EP_INTERVAL_1
 }
};



                                      // usb_user_manufacturer_string_descriptor
code S_usb_manufacturer_string_descriptor usb_user_manufacturer_string_descriptor = {
  sizeof(usb_user_manufacturer_string_descriptor)
, DESCRIPTOR_STRING
, USB_MANUFACTURER_NAME
};


                                      // usb_user_product_string_descriptor

code S_usb_product_string_descriptor usb_user_product_string_descriptor = {
  sizeof(usb_user_product_string_descriptor)
, DESCRIPTOR_STRING
, USB_PRODUCT_NAME
};


                                      // usb_user_serial_number
#if (USB_DEVICE_SN_USE==ENABLE)
code S_usb_serial_number usb_user_serial_number = {
#if (USE_DEVICE_SN_UNIQUE==ENABLE)
  sizeof(usb_user_serial_number)+4*SN_LENGTH
, DESCRIPTOR_STRING
#else
sizeof(usb_user_serial_number)
, DESCRIPTOR_STRING
, USB_SERIAL_NUMBER
#endif
};
#endif

                                      // usb_user_language_id

code S_usb_language_id usb_user_language_id = {
  sizeof(usb_user_language_id)
, DESCRIPTOR_STRING
, Usb_write_word_enum_struc(LANGUAGE_ID)
};

code S_usb_hid_report_descriptor_mouse usb_hid_report_descriptor_mouse = {{
      0x05,0x01,          /* Usage Page (Generic Desktop)      */
      0x09,0x02,          /* Usage (Mouse)                     */
      0xA1,0x01,          /* Collection (Application)          */
      0x09,0x01,          /* Usage (Pointer)                   */
      0xA1,0x00,          /* Collection (Application)          */
      0x05,0x09,          /* Usage Page (Button)               */
      0x19,0x01,          /* Usage Minimum (1)                 */
      0x29,0x03,          /* Usage Maximum (3)                 */
      0x15,0x00,          /* Logical Minimum (0)               */
      0x25,0x01,          /* Logical Maximum (1)               */
      0x75,0x01,          /* Report Size (1)                   */
      0x95,0x03,          /* Report Count (3)                  */
      0x81,0x02,          /* Input (Data, Variable, Absolute)  */
      0x75,0x05,          /* Report Size (5)                   */
      0x95,0x01,          /* Report Count (1)                  */
      0x81,0x01,          /* Input (Constant)                  */
      0x05,0x01,          /* Usage Page (Generic Desktop Control)*/
      0x09,0x30,          /* Usage X                           */
      0x09,0x31,          /* Usage Y                           */
      0x09,0x38,          /* Usage Wheel                       */
      0x15,0x81,          /* Logical Minimum (-127)            */
      0x25,0x7F,          /* Logical Maximum (127)             */
      0x75,0x08,          /* Report Size (8)                   */
      0x95,0x03,          /* Report Count (3)                  */
      0x81,0x06,          /* Input (Data, Variable, Absolute)  */
      0xC0,               /* End Collection                    */
      0xC0                /* End Collection                    */
}};




