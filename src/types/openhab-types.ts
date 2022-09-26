export type OHThing = {
    channels: [
        {
          linkedItems: string[],
          uid: string
          id: string
        //   channelTypeUID: "system:brightness",
        //   itemType: ,
        //   "kind": "STATE",
        //   "label": "Brightness",
          description: string
          defaultTags: string[]
        //   properties: {}
        //   configuration: {}
        }
      ]
    //   statusInfo: {
    //     status: "UNKNOWN",
    //     statusDetail: "NONE"
    //   },
      editable: boolean
      label: string
      bridgeUID: string
    //   configuration: {
    //     id: number
    //   }
    //   properties: {
    //     firmwareVersion: string,
    //     modelId: string,
    //     vendor: string
    //   }
      UID: string
      thingTypeUID: string
}

export type OHItem = {
    link: string
    state: string
    stateDescription?: {
        minimum?: number
        maximum?: number
        step?: number
        pattern?: string
        readOnly?: boolean
        options?: string[]  
    }
    editable: boolean
    type: string // Number:<property> or String
    name: string
    label: string
    category: OHSemantics
    tags: OHSemantics[]
    groupNames: string[]
}

export enum OHType {
  Number = 'Number',
  String = 'String'
}

export type OHSemantics = OHProperty | OHPoint | OHEquipment

export enum OHProperty {
    Light = 'Light',
    ColorTemperature = 'ColorTemperature',
    Humidity = 'Humidity',
    Presence = 'Presence',
    Pressure = 'Pressure',
    Smoke = 'Smoke',
    Noise = 'Noise',
    Rain = 'Rain',
    Wind = 'Wind' ,
    Water = 'Water',
    CO2 = 'CO2',
    CO = 'CO',
    Energy = 'Energy',
    Power = 'Power',
    Voltage = 'Voltage',
    Current = 'Current',
    Frequency = 'Frequency',
    Gas = 'Gas',
    SoundVolume = 'SoundVolume',
    Oil = 'Oil',
    Duration = 'Duration',
    Level = 'Level',
    Opening = 'Opening',
    Timestamp = 'Timestamp',
    Ultraviolet = 'Ultraviolet',
    Vibration = 'Vibration',
    Temperature = 'Temperature' 
}

export enum OHPoint {
    Alarm='Alarm',
    Control='Control',
    Switch='Switch',
    Measurement='Measurement',
    Setpoint='Setpoint',
    Status='Status',
    LowBattery='LowBattery',
    OpenLevel='OpenLevel',
    OpenState='OpenState',
    Tampered='Tampered',
    Tilt='Tilt'
}

export enum OHEquipment {
    AlarmSystem='AlarmSystem',
    Battery='Battery',
    Blinds='Blinds',
    Boiler='Boiler',
    Camera='Camera',
    Car='Car',
    CleaningRobot='CleaningRobot',
    Door='Door',
    BackDoor='BackDoor',
    CellarDoor='CellarDoor',
    FrontDoor='FrontDoor',
    GarageDoor='GarageDoor',
    Gate='Gate',
    InnerDoor='InnerDoor',
    SideDoor='SideDoor',
    Doorbell='Doorbell',
    Fan='Fan',
    CeilingFan='CeilingFan',
    KitchenHood='KitchenHood',
    HVAC='HVAC',
    Inverter='Inverter',
    LawnMower='LawnMower',
    Lightbulb='Lightbulb',
    LightStripe='LightStripe',
    Lock='Lock',
    NetworkAppliance='NetworkAppliance',
    PowerOutlet='PowerOutlet',
    Projector='Projector',
    Pump='Pump',
    RadiatorControl='RadiatorControl',
    Receiver='Receiver',
    RemoteControl='RemoteControl',
    Screen='Screen',
    Television='Television',
    Sensor='Sensor',
    MotionDetector='MotionDetector',
    SmokeDetector='SmokeDetector',
    Siren='Siren',
    Smartphone='Smartphone',
    Speaker='Speaker',
    Valve='Valve',
    VoiceAssistant='VoiceAssistant',
    WallSwitch='WallSwitch',
    WebService='WebService',
    WeatherService='WeatherService',
    WhiteGood='WhiteGood',
    Dishwasher='Dishwasher',
    Dryer='Dryer',
    Freezer='Freezer',
    Oven='Oven',
    Refrigerator='Refrigerator',
    WashingMachine='WashingMachine',
    Window='Window'
}

enum OHLocation {
  Indoor = 'Indoor',
  Apartment = 'Apartment',
  Building = 'Building',
  Garage = 'Garage',
  House = 'House',
  Shed = 'Shed',
  SummerHouse = 'SummerHouse',
  Floor = 'Floor',
  GroundFloor = 'GroundFloor',
  FirstFloor = 'FirstFloor',
  SecondFloor = 'SecondFloor',
  ThirdFloor = 'ThirdFloor',
  Attic = 'Attic',
  Basement = 'Basement',
  Corridor = 'Corridor',
  Room = 'Room',
  Bathroom = 'Bathroom',
  Bedroom = 'Bedroom',
  BoilerRoom = 'BoilerRoom',
  Cellar = 'Cellar',
  DiningRoom = 'DiningRoom',
  Entry = 'Entry',
  FamilyRoom = 'FamilyRoom',
  GuestRoom = 'GuestRoom',
  Kitchen = 'Kitchen',
  LaundryRoom = 'LaundryRoom',
  LivingRoom = 'LivingRoom',
  Office = 'Office',
  Veranda = 'Veranda',
  Outdoor = 'Outdoor',
  Carport = 'Carport',
  Driveway = 'Driveway',
  Garden = 'Garden',
  Patio = 'Patio',
  Porch = 'Porch',
  Terrace = 'Terrace'
}
