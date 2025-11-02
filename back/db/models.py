from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from .database import Base

class Role(Base):
    __tablename__ = 'roles'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), unique=True, nullable=False)

    employees = relationship('Employee', back_populates='role')


class Branch(Base):
    __tablename__ = 'branches'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    address = Column(String(255), nullable=False)
    phone = Column(String(20))

    employees = relationship('Employee', back_populates='branch')


class Employee(Base):
    __tablename__ = 'employees'

    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String(50), nullable=False)
    last_name = Column(String(50), nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    password = Column(String(100), nullable=False)
    role_id = Column(Integer, ForeignKey('roles.id'))
    branch_id = Column(Integer, ForeignKey('branches.id'))

    role = relationship('Role', back_populates='employees')
    branch = relationship('Branch', back_populates='employees')


class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String(50), nullable=False)
    last_name = Column(String(50), nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    phone = Column(String(20), unique=True, nullable=False)
    password = Column(String(100), nullable=False)
    drivers_license = Column(String(20), unique=True)
    balance = Column(Float, default=0.0)

    bookings = relationship('Booking', back_populates='user')
    transactions = relationship('Transaction', back_populates='user')
    incidents = relationship('Incident', back_populates='user')


class Tariff(Base):
    __tablename__ = 'tariffs'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), nullable=False)
    price_per_minute = Column(Float)
    price_per_hour = Column(Float)

    vehicles = relationship('Vehicle', back_populates='tariff')


class ParkingZone(Base):
    __tablename__ = 'parking_zones'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    address = Column(String(255), nullable=False)
    capacity = Column(Integer, default=10)

    vehicles = relationship('Vehicle', back_populates='parking_zone')


class Vehicle(Base):
    __tablename__ = 'vehicles'

    id = Column(Integer, primary_key=True, index=True)
    license_plate = Column(String(20), unique=True, nullable=False)
    brand = Column(String(50), nullable=False)
    model = Column(String(50), nullable=False)
    vehicle_type = Column(String(30), nullable=False)
    year = Column(Integer)
    color = Column(String(30))
    image_url = Column(String(500))
    description = Column(String(500))
    status = Column(String(30), default='available')
    parking_zone_id = Column(Integer, ForeignKey('parking_zones.id'))
    tariff_id = Column(Integer, ForeignKey('tariffs.id'))

    parking_zone = relationship('ParkingZone', back_populates='vehicles')
    tariff = relationship('Tariff', back_populates='vehicles')
    bookings = relationship('Booking', back_populates='vehicle')
    incidents = relationship('Incident', back_populates='vehicle')


class Booking(Base):
    __tablename__ = 'bookings'

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    vehicle_id = Column(Integer, ForeignKey('vehicles.id'))
    tariff_id = Column(Integer, ForeignKey('tariffs.id'))
    start_time = Column(DateTime, nullable=False)
    end_time = Column(DateTime)
    total_cost = Column(Float, default=0.0)
    status = Column(String(30), default='pending')

    user = relationship('User', back_populates='bookings')
    vehicle = relationship('Vehicle', back_populates='bookings')
    transactions = relationship('Transaction', back_populates='booking')
    incidents = relationship('Incident', back_populates='booking')


class Transaction(Base):
    __tablename__ = 'transactions'

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    booking_id = Column(Integer, ForeignKey('bookings.id'))
    transaction_type = Column(String(30), nullable=False)
    amount = Column(Float, nullable=False)
    status = Column(String(30), default='completed')

    user = relationship('User', back_populates='transactions')
    booking = relationship('Booking', back_populates='transactions')


class Incident(Base):
    __tablename__ = 'incidents'

    id = Column(Integer, primary_key=True, index=True)
    booking_id = Column(Integer, ForeignKey('bookings.id'))
    vehicle_id = Column(Integer, ForeignKey('vehicles.id'))
    user_id = Column(Integer, ForeignKey('users.id'))
    incident_type = Column(String(50), nullable=False)
    description = Column(String, nullable=False)
    status = Column(String(30), default='reported')

    booking = relationship('Booking', back_populates='incidents')
    vehicle = relationship('Vehicle', back_populates='incidents')
    user = relationship('User', back_populates='incidents')
