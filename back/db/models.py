from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Index
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

class Role(Base):
    __tablename__ = 'roles'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), unique=True, nullable=False, index=True)

    employees = relationship('Employee', back_populates='role')


class Branch(Base):
    __tablename__ = 'branches'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False, index=True)
    address = Column(String(255), nullable=False)
    phone = Column(String(20))

    employees = relationship('Employee', back_populates='branch')


class Employee(Base):
    __tablename__ = 'employees'

    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String(50), nullable=False)
    last_name = Column(String(50), nullable=False)
    email = Column(String(100), unique=True, nullable=False, index=True)
    password = Column(String(100), nullable=False)
    role_id = Column(Integer, ForeignKey('roles.id'), index=True)
    branch_id = Column(Integer, ForeignKey('branches.id'), index=True)

    role = relationship('Role', back_populates='employees')
    branch = relationship('Branch', back_populates='employees')


class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String(50), nullable=False)
    last_name = Column(String(50), nullable=False)
    email = Column(String(100), unique=True, nullable=False, index=True)
    phone = Column(String(20), unique=True, nullable=False, index=True)
    password = Column(String(100), nullable=False)
    drivers_license = Column(String(20), unique=True)
    balance = Column(Float, default=0.0)

    bookings = relationship('Booking', back_populates='user')
    transactions = relationship('Transaction', back_populates='user')
    incidents = relationship('Incident', back_populates='user')


class Tariff(Base):
    __tablename__ = 'tariffs'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), nullable=False, index=True)
    price_per_minute = Column(Float)
    price_per_hour = Column(Float)

    vehicles = relationship('Vehicle', back_populates='tariff')


class ParkingZone(Base):
    __tablename__ = 'parking_zones'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False, index=True)
    address = Column(String(255), nullable=False)
    capacity = Column(Integer, default=10)

    vehicles = relationship('Vehicle', back_populates='parking_zone')


class Vehicle(Base):
    __tablename__ = 'vehicles'

    id = Column(Integer, primary_key=True, index=True)
    license_plate = Column(String(20), unique=True, nullable=False, index=True)
    brand = Column(String(50), nullable=False, index=True)
    model = Column(String(50), nullable=False)
    vehicle_type = Column(String(30), nullable=False, index=True)
    year = Column(Integer)
    color = Column(String(30))
    image_url = Column(String(500))
    description = Column(String(500))
    status = Column(String(30), default='available', index=True)
    parking_zone_id = Column(Integer, ForeignKey('parking_zones.id'), index=True)
    tariff_id = Column(Integer, ForeignKey('tariffs.id'), index=True)

    parking_zone = relationship('ParkingZone', back_populates='vehicles')
    tariff = relationship('Tariff', back_populates='vehicles')
    bookings = relationship('Booking', back_populates='vehicle')
    incidents = relationship('Incident', back_populates='vehicle')

    # Составной индекс для популярных фильтров
    __table_args__ = (
        Index('ix_vehicle_status_type', 'status', 'vehicle_type'),
        Index('ix_vehicle_brand_model', 'brand', 'model'),
    )


class Booking(Base):
    __tablename__ = 'bookings'

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'), index=True)
    vehicle_id = Column(Integer, ForeignKey('vehicles.id'), index=True)
    tariff_id = Column(Integer, ForeignKey('tariffs.id'), index=True)
    start_time = Column(DateTime, nullable=False, index=True)
    end_time = Column(DateTime)
    total_cost = Column(Float, default=0.0)
    status = Column(String(30), default='pending', index=True)

    user = relationship('User', back_populates='bookings')
    vehicle = relationship('Vehicle', back_populates='bookings')
    transactions = relationship('Transaction', back_populates='booking')
    incidents = relationship('Incident', back_populates='booking')

    # Составной индекс для поиска бронирований пользователя по статусу
    __table_args__ = (
        Index('ix_booking_user_status', 'user_id', 'status'),
        Index('ix_booking_vehicle_status', 'vehicle_id', 'status'),
    )


class Transaction(Base):
    __tablename__ = 'transactions'

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'), index=True)
    booking_id = Column(Integer, ForeignKey('bookings.id'), index=True)
    transaction_type = Column(String(30), nullable=False, index=True)
    amount = Column(Float, nullable=False)
    description = Column(String(500))
    created_at = Column(DateTime, default=datetime.utcnow)
    status = Column(String(30), default='completed', index=True)

    user = relationship('User', back_populates='transactions')
    booking = relationship('Booking', back_populates='transactions')

    # Индекс для поиска транзакций пользователя по типу
    __table_args__ = (
        Index('ix_transaction_user_type', 'user_id', 'transaction_type'),
    )


class Incident(Base):
    __tablename__ = 'incidents'

    id = Column(Integer, primary_key=True, index=True)
    booking_id = Column(Integer, ForeignKey('bookings.id'), index=True)
    vehicle_id = Column(Integer, ForeignKey('vehicles.id'), index=True)
    user_id = Column(Integer, ForeignKey('users.id'), index=True)
    incident_type = Column(String(50), nullable=False, index=True)
    description = Column(String, nullable=False)
    status = Column(String(30), default='reported', index=True)

    booking = relationship('Booking', back_populates='incidents')
    vehicle = relationship('Vehicle', back_populates='incidents')
    user = relationship('User', back_populates='incidents')

    # Индексы для фильтрации инцидентов
    __table_args__ = (
        Index('ix_incident_status_type', 'status', 'incident_type'),
        Index('ix_incident_vehicle_status', 'vehicle_id', 'status'),
    )
